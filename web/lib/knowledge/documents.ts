import prisma from "../clients/prisma";
import { generateEmbedding } from "./embeddings";
import { DocumentSection } from "../upload/types";

interface CreateDocumentInput {
  name: string;
  data: DocumentSection[];
}

export const getDocuments = async () => {
  // LATER: add where clause using userId
  return prisma.knowledgeDocument.findMany({ include: { sections: true } });
};

export const getDocumentById = async (id: string) => {
  const document = await prisma.knowledgeDocument.findUnique({
    where: { id },
    include: { sections: true },
  });

  if (!document) throw new Error("Document not found");

  return document;
};

export const getDocumentIdByName = async (name: string) => {
  // TODO: add userId for filtering document using findUnique and add @@unique[userId, name] in db
  const document = await prisma.knowledgeDocument.findFirst({
    where: { name },
    select: { id: true },
  });

  if (!document) throw new Error("Document not found");

  return document.id;
};

export const createDocument = async ({ name, data }: CreateDocumentInput) => {
  const document = await prisma.knowledgeDocument.create({
    data: { name, sections: { create: data } },
    include: { sections: true },
  });

  // TODO: Fix embedding generation failure
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
