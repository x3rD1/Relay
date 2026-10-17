import { generateResponse } from "@/lib/response/llm";
import { generateResponseSchema } from "@/lib/response/schema";
import {
  getDocumentSectionById,
  SectionNotFoundError,
} from "@/lib/response/sections";
import z from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript: question, sectionId } =
      generateResponseSchema.parse(body);

    try {
      const section = await getDocumentSectionById(sectionId);

      const response = await generateResponse(question, section);

      return Response.json(response);
    } catch (error) {
      if (error instanceof SectionNotFoundError) {
        return Response.json({ error: error.message }, { status: 404 });
      }

      console.error(error);
      return Response.json({ error: "Something went wrong." }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }

    console.error(error);
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
}
