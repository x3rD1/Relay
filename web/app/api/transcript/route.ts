import { analyzeTranscript } from "@/lib/jev";
import { activeWorkflow, workflow } from "@/lib/workflow";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript }: { transcript: string } = body;

    const jevResponse = await analyzeTranscript(transcript, activeWorkflow);

    const llmResponse = await workflow(transcript, jevResponse);

    console.log(llmResponse);

    return Response.json({ success: true, data: llmResponse });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
