import * as z from "zod";

export type WorkflowInput = z.infer<typeof workflowSchema>;

const workflowStepSchema = z.object({
  instruction: z.string().trim().nonempty(),
  order: z.number().int().min(1),
  required: z.boolean(),
});

export const workflowSchema = z.object({
  name: z.string().trim().nonempty(),
  goal: z.string().trim().nonempty(),
  criteria: z.string().trim().nonempty(),
  rules: z.array(z.string().trim()),
  steps: z.array(workflowStepSchema),
});
