import dotenv from 'dotenv';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { createRagClients } from '../src/lib/rag/clients';
import { getRagConfig } from '../src/lib/rag/config';
import { indexResumeFiles } from '../src/lib/rag/indexer';
import {
  createRagLogContext,
  logRagEvent,
  safeRagErrorMessage,
} from '../src/lib/rag/logging';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

async function main(): Promise<void> {
  let clients: ReturnType<typeof createRagClients> | undefined;
  let logContext = createRagLogContext();
  try {
    const config = getRagConfig();
    logContext = createRagLogContext([
      config.geminiApiKey,
      config.qdrantApiKey,
      config.neo4jPassword,
    ]);
    const resumeDirectory = path.resolve(process.cwd(), 'Resume PDFs');
    logRagEvent('info', logContext, 'index_file_scan_started', {
      directory: resumeDirectory,
    });
    const files = (await readdir(resumeDirectory))
      .filter((file) => file.toLocaleLowerCase().endsWith('.pdf'))
      .sort()
      .map((file) => path.join(resumeDirectory, file));

    if (files.length === 0) {
      throw new Error(`No PDF files found in "${resumeDirectory}".`);
    }
    logRagEvent('info', logContext, 'index_file_scan_completed', {
      documents: files.length,
      files: files.map((file) => path.basename(file)).join(', '),
    });

    clients = createRagClients(config);
    const result = await indexResumeFiles(clients, config, files, logContext);
    console.log(
      `Resume indexing complete: ${result.documents} PDFs, ${result.chunks} chunks, ${result.vectorSize}-dimension vectors in "${config.qdrantCollection}".`,
    );
  } catch (error) {
    logRagEvent('error', logContext, 'index_failed', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: safeRagErrorMessage(error, logContext.secrets),
    });
    throw error;
  } finally {
    if (clients) await clients.neo4j.close();
  }
}

main().catch((error: unknown) => {
  console.error('Resume indexing failed:', error);
  process.exitCode = 1;
});
