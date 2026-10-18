import prisma from "../clients/prisma";
import { generateEmbedding } from "./embeddings";
import { DocumentSection } from "../upload/types";

interface CreateDocumentInput {
  name: string;
  data: DocumentSection[];
  userId: string;
}

export const getDocuments = async (userId: string) => {
  return prisma.knowledgeDocument.findMany({
    where: { userId },
    include: { sections: true },
  });
};

export const createDocument = async ({
  name,
  data,
  userId,
}: CreateDocumentInput) => {
  const document = await prisma.knowledgeDocument.create({
    data: { name, sections: { create: data }, userId },
    include: { sections: true },
  });

  let embedding: number[];
  for (const section of document.sections) {
    embedding = await generateEmbedding(section);

    const vectorString = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
        UPDATE "knowledgeSections"
        SET "embedding" = ${vectorString}::vector
        WHERE "id" = ${section.id}
    `;
  }

  return document;
};
