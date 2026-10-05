import type { GoogleGenAI } from '@google/genai';

export async function embedText(
  gemini: GoogleGenAI,
  model: string,
  text: string,
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY',
): Promise<number[]> {
  const response = await gemini.models.embedContent({
    model,
    contents: text,
    config: { taskType },
  });
  const values = response.embeddings?.[0]?.values;
  if (!values?.length || values.some((value) => !Number.isFinite(value))) {
    throw new Error('Gemini returned an empty or invalid embedding.');
  }
  return values;
}
