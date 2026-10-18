import { SectionNotFoundError } from "@/errors";
import prisma from "../clients/prisma";

export const getDocumentSectionById = async (
  sectionId: string,
  userId: string,
) => {
  const section = await prisma.knowledgeSection.findFirst({
    where: { id: sectionId, knowledgeDocument: { userId } },
  });

  if (!section) throw new SectionNotFoundError();

  return { title: section.title, content: section.content };
};
