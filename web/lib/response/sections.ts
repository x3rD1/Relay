import prisma from "../clients/prisma";

export class SectionNotFoundError extends Error {
  constructor() {
    super("Section not found.");
    this.name = "SectionNotFoundError";
  }
}

export const getDocumentSectionById = async (sectionId: string) => {
  // TODO: check authorization through resource ownership

  const section = await prisma.knowledgeSection.findUnique({
    where: { id: sectionId },
  });

  if (!section) throw new SectionNotFoundError();

  return { title: section.title, content: section.content };
};
