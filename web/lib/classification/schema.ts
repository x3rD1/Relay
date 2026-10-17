import { z } from "zod";

export const transcriptSchema = z
  .object({
    transcript: z
      .string("Transcript is missing from the payload")
      .trim()
      .min(1, "Transcript is required"),
  })
  .strict();

export const jevResponseSchema = z.object({
  answers: z.object({
    policy: z.object({
      type: z.literal("choice"),
      choice: z.string(),
      confidence: z.number(),
      probabilities: z.record(z.string(), z.number()),
    }),
  }),
});
