import prisma from "../clients/prisma";
import { generateQueryEmbedding } from "../knowledge/embeddings";

interface Section {
  id: string;
  title: string;
  content: string;
  distance: number;
}

export async function retrieveRelevantSections(
  question: string,
  documentId: string,
  userId: string,
) {
  const vector = await generateQueryEmbedding(question);

  const vectorString = `[${vector.join(",")}]`;

  const sections = await prisma.$queryRaw<Section[]>`
  SELECT s.id, s.title, s.content, s.embedding <=> ${vectorString}::vector AS distance
  FROM "knowledgeSections" AS s
  INNER JOIN "knowledgeDocuments" AS d
    ON s."knowledgeDocumentId" = d.id
  WHERE d.id = ${documentId}
    AND d."userId" = ${userId}
    AND s.embedding IS NOT NULL
  ORDER BY s.embedding <=> ${vectorString}::vector ASC
  LIMIT 3
`;

  // console.log(sections);

  // const relevantSections = sections.filter(
  //   (section) => section.distance < 0.45,
  // );

  return sections;
}
