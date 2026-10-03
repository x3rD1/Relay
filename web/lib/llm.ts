import { GoogleGenAI } from "@google/genai";
import { systemInstruction } from "./systemInstruction";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let latestInteractionId: string | undefined = undefined;

export async function generateResponse(
  instructions: string,
  transcript: string,
) {
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",
    system_instruction: [systemInstruction(), instructions].join("\n"),
    input: transcript,
    previous_interaction_id: latestInteractionId,
  });

  latestInteractionId = interaction.id;

  return interaction.output_text ?? "";
}
