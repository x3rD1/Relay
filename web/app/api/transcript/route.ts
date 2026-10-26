import { buildDocumentChoices } from "@/lib/classification/documentChoices";
import { analyzeTranscript } from "@/lib/classification/jev";
import { transcriptSchema } from "@/lib/classification/schema";
import { relevantPolicies } from "@/utils/relevantPolicies";
import z from "zod";
import { getAuthenticatedUserId } from "@/lib/auth/auth";
import { HttpError } from "@/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transcript = transcriptSchema.parse(body).transcript;

    try {
      const userId = await getAuthenticatedUserId();

      const { documentChoices, documents } = await buildDocumentChoices(userId);

      const jevResponse = await analyzeTranscript(transcript, documentChoices);
      const policy = jevResponse.answers.policy.choice;

      if (policy === "other") return Response.json({ policies: [] });

      const probabilities = jevResponse.answers.policy.probabilities;
      const suggestedPolicies = relevantPolicies(probabilities);

      const policies = suggestedPolicies
        .map((name) => {
          const document = documents.find((doc) => doc.name === name);

          if (!document) return null;

          return { id: document.id, name: document.name };
        })
        .filter((document) => document !== null);

      return Response.json({ policies });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json({ error: error.issues }, { status: 502 });
      }

      if (error instanceof HttpError) {
        return Response.json(
          { error: error.message },
          { status: error.statusCode },
        );
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
