import * as z from "zod";
import { createWorkflow, getAllWorkflows } from "@/lib/workflows";
import { workflowSchema, WorkflowInput } from "@/schemas/workflow";

export async function GET() {
  try {
    const workflows = await getAllWorkflows();

    return Response.json(workflows);
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let validatedData: WorkflowInput;

  try {
    const body = await request.json();

    validatedData = workflowSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }

    console.error(error);
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await createWorkflow(validatedData);

    return new Response(null, { status: 201 });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
