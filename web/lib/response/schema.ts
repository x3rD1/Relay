import z from "zod";

export const generateResponseSchema = z.object({
  transcript: z.string().trim().min(1),
  sectionId: z.string().trim().min(1, "Section ID must be included"),
});
