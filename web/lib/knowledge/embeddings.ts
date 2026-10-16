import { ai } from "../clients/ai";

interface GenerateEmbeddingInput {
  title: string;
  content: string;
}

export async function generateEmbedding({
  title,
  content,
}: GenerateEmbeddingInput): Promise<number[]> {
  const section = title.concat(" ", content);

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: section,
    config: { outputDimensionality: 768 },
  });

  const vector = response.embeddings?.[0]?.values;

  if (!vector || vector.length === 0) {
    return [];
  }

  return vector;
}

export async function generateQueryEmbedding(question: string) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: question,
    config: { outputDimensionality: 768 },
  });

  const vector = response.embeddings?.[0]?.values;

  if (!vector || vector.length === 0) {
    return [];
  }

  return vector;
}
