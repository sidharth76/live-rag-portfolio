import neo4j, { type Driver } from 'neo4j-driver';
import type { ResumeChunk } from './text';
import { extractKnownEntities } from './text';

export async function ensureGraphConstraints(driver: Driver, database: string): Promise<void> {
  const session = driver.session({ database });
  try {
    await session.run(
      'CREATE CONSTRAINT resume_document_id IF NOT EXISTS FOR (node:ResumeDocument) REQUIRE node.id IS UNIQUE',
    );
    await session.run(
      'CREATE CONSTRAINT resume_chunk_id IF NOT EXISTS FOR (node:ResumeChunk) REQUIRE node.id IS UNIQUE',
    );
    await session.run(
      'CREATE CONSTRAINT resume_entity_key IF NOT EXISTS FOR (node:ResumeEntity) REQUIRE node.key IS UNIQUE',
    );
  } finally {
    await session.close();
  }
}

export async function upsertChunkGraph(
  driver: Driver,
  database: string,
  chunk: ResumeChunk,
): Promise<void> {
  const entities = extractKnownEntities(chunk.text).map((name) => ({
    name,
    key: name.toLocaleLowerCase(),
  }));
  const session = driver.session({ database });
  try {
    await session.run(
      `
      MERGE (document:ResumeDocument {id: $source})
      SET document.filename = $source
      MERGE (chunk:ResumeChunk {id: $id})
      SET chunk.text = $text, chunk.source = $source, chunk.page = $page, chunk.index = $index
      MERGE (document)-[:HAS_CHUNK]->(chunk)
      WITH chunk
      UNWIND $entities AS entityData
      MERGE (entity:ResumeEntity {key: entityData.key})
      SET entity.name = entityData.name
      MERGE (chunk)-[:MENTIONS]->(entity)
      `,
      {
        id: chunk.id,
        source: chunk.source,
        text: chunk.text,
        page: neo4j.int(chunk.page),
        index: neo4j.int(chunk.index),
        entities,
      },
    );
  } finally {
    await session.close();
  }
}

export interface RelatedChunk {
  id: string;
  source: string;
  page: number;
  text: string;
}

export async function findGraphRelatedChunks(
  driver: Driver,
  database: string,
  chunkIds: string[],
  limit: number,
): Promise<RelatedChunk[]> {
  if (chunkIds.length === 0) return [];
  const session = driver.session({ database });
  try {
    const result = await session.run(
      `
      UNWIND $ids AS chunkId
      MATCH (:ResumeChunk {id: chunkId})-[:MENTIONS]->(entity:ResumeEntity)
            <-[:MENTIONS]-(related:ResumeChunk)
      WHERE related.id <> chunkId
      RETURN DISTINCT related.id AS id, related.source AS source,
             related.page AS page, related.text AS text
      LIMIT $limit
      `,
      { ids: chunkIds, limit: neo4j.int(limit) },
    );

    return result.records.map((record) => ({
      id: record.get('id') as string,
      source: record.get('source') as string,
      page: neo4j.integer.toNumber(record.get('page')),
      text: record.get('text') as string,
    }));
  } finally {
    await session.close();
  }
}
