import { WorkflowInput } from "@/schemas/workflow";
import prisma from "./prisma";

export const createWorkflow = async ({
  name,
  goal,
  criteria,
  rules,
  steps,
}: WorkflowInput) => {
  return prisma.workflow.create({
    data: {
      name,
      goal,
      criteria,
      rules,
      steps: {
        create: steps,
      },
    },
  });
};
