import { GoogleGenAI } from '@google/genai';
import { QdrantClient } from '@qdrant/js-client-rest';
import neo4j, { type Driver } from 'neo4j-driver';
import type { RagConfig } from './config';

export interface RagClients {
  gemini: GoogleGenAI;
  qdrant: QdrantClient;
  neo4j: Driver;
}

export function createRagClients(config: RagConfig): RagClients {
  return {
    gemini: new GoogleGenAI({ apiKey: config.geminiApiKey }),
    qdrant: new QdrantClient({
      url: config.qdrantUrl,
      apiKey: config.qdrantApiKey,
    }),
    neo4j: neo4j.driver(
      config.neo4jUri,
      neo4j.auth.basic(config.neo4jUsername, config.neo4jPassword),
    ),
  };
}
