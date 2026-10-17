import z from "zod";

export const retrieveSectionsSchema = z
  .object({
    transcript: z.string().trim().min(1),
    documentId: z.string().trim().min(1, "Document ID must be included"),
  })
  .strict();
