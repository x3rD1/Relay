import prisma from "../clients/prisma";
import { generateQueryEmbedding } from "./embeddings";

interface Section {
  id: string;
  title: string;
  content: string;
  distance: number;
}

export async function retrieveRelevantSections(
  documentId: string,
  question: string,
) {
  const vector = await generateQueryEmbedding(question);

  const vectorString = `[${vector.join(",")}]`;

  const sections = await prisma.$queryRaw<Section[]>`
    SELECT id, title, content, embedding <=> ${vectorString}::vector AS distance
    FROM "knowledgeSections" 
    WHERE "knowledgeDocumentId" = ${documentId} 
      AND embedding IS NOT NULL 
    ORDER BY embedding <=> ${vectorString}::vector  ASC 
    LIMIT 3`;

  const relevantSections = sections.filter(
    (section) => section.distance < 0.45,
  );

  return relevantSections;
}
