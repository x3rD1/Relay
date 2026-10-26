import { retrieveRelevantSections } from "@/lib/retrieval/retrieveRelevantSections";
import { retrieveSectionsSchema } from "@/lib/retrieval/schema";
import z from "zod";
import { getAuthenticatedUserId } from "@/lib/auth/auth";
import { HttpError } from "@/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript: question, documentId } =
      retrieveSectionsSchema.parse(body);

    try {
      const userId = await getAuthenticatedUserId();

      const sections = await retrieveRelevantSections(
        question,
        documentId,
        userId,
      );

      return Response.json(sections);
    } catch (error) {
      console.error(error);

      if (error instanceof HttpError) {
        return Response.json(
          { error: error.message },
          { status: error.statusCode },
        );
      }

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
