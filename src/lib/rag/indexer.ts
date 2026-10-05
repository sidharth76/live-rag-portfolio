import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';
import type { RagConfig } from './config';
import type { RagClients } from './clients';
import { embedText } from './embeddings';
import { ensureGraphConstraints, upsertChunkGraph } from './graph';
import {
  createRagLogContext,
  logRagEvent,
  runRagStep,
  type RagLogContext,
} from './logging';
import { splitTextIntoChunks, type ResumeChunk } from './text';

const UPSERT_BATCH_SIZE = 32;

export async function indexResumeFiles(
  clients: RagClients,
  config: RagConfig,
  files: string[],
  existingLogContext?: RagLogContext,
): Promise<{ documents: number; chunks: number; vectorSize: number }> {
  const logContext = existingLogContext ?? createRagLogContext([
    config.geminiApiKey,
    config.qdrantApiKey,
    config.neo4jPassword,
  ]);
  logRagEvent('info', logContext, 'index_started', {
    documents: files.length,
    collection: config.qdrantCollection,
    embeddingModel: config.embeddingModel,
  });

  if (files.length === 0) {
    throw new Error('No PDF resume files were supplied for indexing.');
  }

  const chunks: ResumeChunk[] = [];
  for (const file of files) {
    const source = path.basename(file);
    const documentChunks = await runRagStep(
      logContext,
      'extract_and_chunk_pdf',
      async () => {
        const parser = new PDFParse({ data: new Uint8Array(await readFile(file)) });
        try {
          const parsed = await parser.getText();
          return parsed.pages.flatMap((page) =>
            splitTextIntoChunks(page.text, source, page.num),
          );
        } finally {
          await parser.destroy();
        }
      },
      { source },
    );
    chunks.push(...documentChunks);
    logRagEvent('info', logContext, 'pdf_index_prepared', {
      source,
      chunks: documentChunks.length,
      totalChunks: chunks.length,
    });
  }

  if (chunks.length === 0) {
    throw new Error('The PDFs did not contain extractable text; no vectors were indexed.');
  }

  const firstVector = await runRagStep(
    logContext,
    'embed_first_resume_chunk',
    () => embedText(
      clients.gemini,
      config.embeddingModel,
      chunks[0].text,
      'RETRIEVAL_DOCUMENT',
    ),
    { model: config.embeddingModel, totalChunks: chunks.length },
  );
  await runRagStep(
    logContext,
    'check_or_create_qdrant_collection',
    () => ensureCollection(clients, config, firstVector.length),
    { collection: config.qdrantCollection, vectorSize: firstVector.length },
  );
  await runRagStep(
    logContext,
    'prepare_neo4j_graph',
    () => ensureGraphConstraints(clients.neo4j, config.neo4jDatabase),
    { database: config.neo4jDatabase },
  );

  for (let start = 0; start < chunks.length; start += UPSERT_BATCH_SIZE) {
    const batch = chunks.slice(start, start + UPSERT_BATCH_SIZE);
    const vectors = await runRagStep(
      logContext,
      'embed_resume_chunk_batch',
      () => start === 0
        ? Promise.all([
            Promise.resolve(firstVector),
            ...batch.slice(1).map((chunk) =>
              embedText(clients.gemini, config.embeddingModel, chunk.text, 'RETRIEVAL_DOCUMENT'),
            ),
          ])
        : Promise.all(
            batch.map((chunk) =>
              embedText(clients.gemini, config.embeddingModel, chunk.text, 'RETRIEVAL_DOCUMENT'),
            ),
          ),
      { batchStart: start, batchSize: batch.length, totalChunks: chunks.length },
    );

    if (vectors.some((vector) => vector.length !== firstVector.length)) {
      throw new Error('Gemini returned inconsistent embedding dimensions; stopping before Qdrant upsert.');
    }

    await runRagStep(
      logContext,
      'upsert_qdrant_chunk_batch',
      () => clients.qdrant.upsert(config.qdrantCollection, {
        wait: true,
        points: batch.map((chunk, index) => ({
          id: chunk.id,
          vector: vectors[index],
          payload: {
            text: chunk.text,
            source: chunk.source,
            page: chunk.page,
            chunkIndex: chunk.index,
          },
        })),
      }),
      { collection: config.qdrantCollection, batchStart: start, batchSize: batch.length },
    );

    await runRagStep(
      logContext,
      'upsert_neo4j_chunk_batch',
      () => Promise.all(
        batch.map((chunk) => upsertChunkGraph(clients.neo4j, config.neo4jDatabase, chunk)),
      ),
      { database: config.neo4jDatabase, batchStart: start, batchSize: batch.length },
    );
    logRagEvent('info', logContext, 'index_progress', {
      indexedChunks: Math.min(start + batch.length, chunks.length),
      totalChunks: chunks.length,
    });
  }

  logRagEvent('info', logContext, 'index_completed', {
    documents: files.length,
    chunks: chunks.length,
    vectorSize: firstVector.length,
    collection: config.qdrantCollection,
  });
  return {
    documents: files.length,
    chunks: chunks.length,
    vectorSize: firstVector.length,
  };
}

async function ensureCollection(
  clients: RagClients,
  config: RagConfig,
  vectorSize: number,
): Promise<void> {
  const collections = await clients.qdrant.getCollections();
  const exists = collections.collections.some(
    (collection) => collection.name === config.qdrantCollection,
  );

  if (!exists) {
    await clients.qdrant.createCollection(config.qdrantCollection, {
      vectors: { size: vectorSize, distance: 'Cosine' },
    });
    return;
  }

  const collection = await clients.qdrant.getCollection(config.qdrantCollection);
  const vectors = collection.config.params.vectors;
  if (
    typeof vectors !== 'object' ||
    vectors === null ||
    !('size' in vectors) ||
    vectors.size !== vectorSize
  ) {
    throw new Error(
      `Qdrant collection "${config.qdrantCollection}" does not match the ${vectorSize}-dimension Gemini embeddings. Use a fresh collection name or resolve its vector configuration before indexing.`,
    );
  }
}
