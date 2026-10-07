import { WorkflowInput } from "@/schemas/workflow";
import prisma from "./prisma";
import { Prisma } from "@/app/generated/prisma/client";

export const getAllWorkflows = async () => {
  // LATER: Find all workflows from the specific user using userId

  return prisma.workflow.findMany({
    include: {
      steps: {
        select: { instruction: true, required: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getWorkflowById = async (id: string) => {
  return await prisma.workflow.findUnique({
    where: { id },
    include: { steps: { orderBy: { order: "asc" } } },
  });
};

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

export const updateWorkflow = async (
  id: string,
  validatedData: WorkflowInput,
) => {
  try {
    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: {
        name: validatedData.name,
        goal: validatedData.goal,
        criteria: validatedData.criteria,
        rules: validatedData.rules,
        steps: {
          deleteMany: {},
          create: validatedData.steps,
        },
      },
      include: { steps: true },
    });

    return updatedWorkflow;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("WORKFLOW_NOT_FOUND");
    }

    throw error;
  }
};

export const deleteWorkflow = async (id: string) => {
  const { count } = await prisma.workflow.deleteMany({ where: { id } });

  if (count === 0) {
    throw new Error("WORKFLOW_NOT_FOUND");
  }
};
