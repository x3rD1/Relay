import { analyzeTranscript } from "@/lib/jev";
import { activeWorkflow, workflow } from "@/lib/workflow";

const customerContext: string[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript }: { transcript: string } = body;

    customerContext.push(transcript);

    const jevResponse = await analyzeTranscript(
      customerContext,
      activeWorkflow,
    );

    const llmResponse = await workflow(transcript, jevResponse);

    console.log(llmResponse);

    return Response.json({ success: true, data: llmResponse });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
