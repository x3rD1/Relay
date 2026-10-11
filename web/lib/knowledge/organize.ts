import { ai } from "../clients/ai";
import { DocumentSection, documentSectionSchema } from "./types";

const documentJsonSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "The heading or semantic label for this section.",
      },
      content: {
        type: "string",
        description: "The body text or payload governed by the title.",
      },
    },
    required: ["title", "content"],
  },
};

const instructions = `Organize the extracted text into logically related sections.
    Give each section a descriptive title and its corresponding content.
    Preserve all factual details, dates, deadlines, conditions, exceptions, and requirements.
    Correct broken line wrapping and formatting artifacts.
    Never invent missing information or change the original meaning.
    Return only valid JSON, formatted as an array of objects with title and content properties.`;

export async function organizeDocument(
  text: string,
): Promise<DocumentSection[]> {
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",
    system_instruction: instructions,
    input: text,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: documentJsonSchema,
    },
  });

  if (!interaction.output_text) throw new Error("LLM response is empty");

  const response = JSON.parse(interaction.output_text);

  return documentSectionSchema.array().parse(response);
}
