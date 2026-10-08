import { analyzeTranscript } from "@/lib/jev";
import { activeWorkflow, workflow } from "@/lib/workflow";
import { buildWorkflowChoices } from "@/lib/workflowChoices";

const customerContext: string[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript }: { transcript: string } = body;

    const workflowChoices = await buildWorkflowChoices();

    customerContext.push(transcript);

    const jevResponse = await analyzeTranscript(
      customerContext,
      activeWorkflow,
      workflowChoices,
    );

    const llmResponse = await workflow(transcript, jevResponse);

    console.log(llmResponse);

    return Response.json({ success: true, data: llmResponse });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
