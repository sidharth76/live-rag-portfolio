export interface RagConfig {
  geminiApiKey: string;
  embeddingModel: string;
  generationModel: string;
  qdrantUrl: string;
  qdrantApiKey: string;
  qdrantCollection: string;
  neo4jUri: string;
  neo4jUsername: string;
  neo4jPassword: string;
  neo4jDatabase: string;
}

export class RagConfigurationError extends Error {
  constructor(readonly missingVariables: string[]) {
    super(`Missing required RAG environment variables: ${missingVariables.join(', ')}`);
    this.name = 'RagConfigurationError';
  }
}

export function getRagConfig(): RagConfig {
  const required = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    QDRANT_URL: process.env.QDRANT_URL,
    QDRANT_API_KEY: process.env.QDRANT_API_KEY,
    NEO4J_URI: process.env.NEO4J_URI,
    NEO4J_USERNAME: process.env.NEO4J_USERNAME,
    NEO4J_PASSWORD: process.env.NEO4J_PASSWORD,
  };
  const missingVariables = Object.entries(required)
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name);

  if (missingVariables.length > 0) {
    throw new RagConfigurationError(missingVariables);
  }

  return {
    geminiApiKey: required.GEMINI_API_KEY!,
    embeddingModel: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',
    generationModel: process.env.GEMINI_GENERATION_MODEL || 'gemini-3.8-flash',
    qdrantUrl: required.QDRANT_URL!,
    qdrantApiKey: required.QDRANT_API_KEY!,
    qdrantCollection: process.env.QDRANT_COLLECTION || 'portfolio_resume_chunks',
    neo4jUri: required.NEO4J_URI!,
    neo4jUsername: required.NEO4J_USERNAME!,
    neo4jPassword: required.NEO4J_PASSWORD!,
    neo4jDatabase: process.env.NEO4J_DATABASE || 'neo4j',
  };
}
