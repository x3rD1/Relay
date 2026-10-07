import {
  deleteWorkflow,
  getWorkflowById,
  updateWorkflow,
} from "@/lib/workflows";
import { workflowSchema } from "@/schemas/workflow";
import * as z from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const workflow = await getWorkflowById(id);

    if (!workflow) {
      return Response.json({ error: "Workflow not found" }, { status: 404 });
    }

    return Response.json(workflow);
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validatedData = workflowSchema.parse(body);

    const updatedWorkflow = await updateWorkflow(id, validatedData);

    return Response.json(updatedWorkflow);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }

    console.error(error);

    if (error instanceof Error) {
      if (error.message === "WORKFLOW_NOT_FOUND") {
        return Response.json({ error: "Workflow not found" }, { status: 404 });
      }
    }

    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await deleteWorkflow(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "WORKFLOW_NOT_FOUND") {
        return Response.json({ error: "Workflow not found" }, { status: 404 });
      }
    }

    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
