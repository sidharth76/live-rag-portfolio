import { createHash } from 'node:crypto';

export interface ResumeChunk {
  id: string;
  source: string;
  page: number;
  index: number;
  text: string;
}

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 160;

export function splitTextIntoChunks(
  text: string,
  source: string,
  page: number,
): ResumeChunk[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const chunks: ResumeChunk[] = [];
  let start = 0;

  while (start < normalized.length) {
    let end = Math.min(start + CHUNK_SIZE, normalized.length);
    if (end < normalized.length) {
      const lastSpace = normalized.lastIndexOf(' ', end);
      if (lastSpace > start) end = lastSpace;
    }

    const chunkText = normalized.slice(start, end).trim();
    if (chunkText) {
      const index = chunks.length;
      chunks.push({
        id: createStableChunkId(source, page, index, chunkText),
        source,
        page,
        index,
        text: chunkText,
      });
    }

    if (end >= normalized.length) break;
    start = Math.max(end - CHUNK_OVERLAP, start + 1);
  }

  return chunks;
}

function createStableChunkId(
  source: string,
  page: number,
  index: number,
  text: string,
): string {
  const bytes = createHash('sha256')
    .update(`${source}\0${page}\0${index}\0${text}`)
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const RESUME_ENTITIES = [
  'Sidharth Wadhwa',
  'TCAIGV Technologies',
  'Tech Cubes AI',
  'Innosn Web Technology',
  'LightMES',
  'Maintenance Command Center',
  'Chandigarh Group of Colleges',
  'RAG',
  'Retrieval-Augmented Generation',
  'Multimodal',
  'Qdrant',
  'Neo4j',
  'Ollama',
  'Azure OpenAI',
  'LangGraph',
  'CrewAI',
  'ColQwen',
  'Docker',
  'Python',
  'SQL',
  'MySQL',
  'Power BI',
  'Machine Learning',
  'Predictive Maintenance',
  'Anomaly Detection',
  'Blinkit',
  'World Layoffs',
  'Salesforce',
  'Git',
];

export function extractKnownEntities(text: string): string[] {
  const normalizedText = text.toLocaleLowerCase();
  return RESUME_ENTITIES.filter((entity) =>
    normalizedText.includes(entity.toLocaleLowerCase()),
  );
}
