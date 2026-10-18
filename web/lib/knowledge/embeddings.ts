import { VectorGenerationError } from "@/errors";
import { ai } from "../clients/ai";

interface GenerateEmbeddingInput {
  title: string;
  content: string;
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function generateEmbedding({
  title,
  content,
}: GenerateEmbeddingInput): Promise<number[]> {
  const section = title.concat(" ", content);

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: section,
        config: { outputDimensionality: 768 },
      });

      const vector = response.embeddings?.[0]?.values;

      if (!vector || vector.length === 0) {
        throw new VectorGenerationError();
      }

      return vector;
    } catch (error) {
      if (attempt === 2) {
        console.error(error);
        throw new VectorGenerationError();
      }

      await sleep(attempt === 0 ? 500 : 1000);
    }
  }

  throw new VectorGenerationError();
}

export async function generateQueryEmbedding(question: string) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: question,
    config: { outputDimensionality: 768 },
  });

  const vector = response.embeddings?.[0]?.values;

  if (!vector || vector.length === 0) {
    throw new VectorGenerationError();
  }

  return vector;
}
