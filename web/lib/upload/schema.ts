import z from "zod";

export const documentSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const documentNameSchema = z.object({
  name: z.string().trim().nonempty("Document name is required"),
});
