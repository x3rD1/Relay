import { analyzeTranscript } from "./jev";
import { treeWorkflow } from "./treeWorkflow";
import { generateResponse } from "./llm";

export let activeWorkflow = "";
let activeInstructions = "";

export async function workflow(
  transcript: string,
  jevResponse: Awaited<ReturnType<typeof analyzeTranscript>>,
) {
  const topic = jevResponse.answers.topic.choice;
  const is_topic_change = jevResponse.answers.is_topic_change.noul;

  switch (topic) {
    case "pools":
      if (!activeWorkflow || is_topic_change >= 0.8) {
        console.log("POOL WORKFLOW");
      }
      break;

    case "trees":
      if (!activeWorkflow || is_topic_change >= 0.8) {
        activeWorkflow = "trees";
        activeInstructions = treeWorkflow();
      }

      break;

    case "refund":
      if (!activeWorkflow || is_topic_change >= 0.8) {
        activeWorkflow = "refund";
        console.log("REFUND WORKFLOW");
      }
      break;

    case "other":
      console.log("NO WORKFLOW CHANGE");
      break;

    default:
      break;
  }

  const response = await generateResponse(activeInstructions, transcript);

  return response;
}
