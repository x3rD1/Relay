import { jevResponseSchema } from "./schema";

const TYPESAFE_API_URL = process.env.TYPESAFE_API;
const API_KEY = process.env.JEV_API_KEY;

const JEV_MODEL = "jev-latest";

export async function analyzeTranscript(
  transcripts: string,
  documentChoices: Record<string, string>,
) {
  if (!TYPESAFE_API_URL)
    throw new Error("Configuration Error: TYPESAFE_API is not defined");
  if (!API_KEY)
    throw new Error("Configuration Error: JEV_API_KEY is not defined");

  try {
    const response = await fetch(TYPESAFE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: JEV_MODEL,
        state: transcripts,
        questions: {
          policy: {
            type: "choice",
            instructions: `
            Which knowledge document best matches the customer's latest request?
            `,
            criteria: documentChoices,
          },
        },
      }),
    });

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status} (${response.statusText})`;

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();

        errorMessage =
          errorData.message || errorData.error || JSON.stringify(errorData);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    console.log("Full answer: ", data);

    return jevResponseSchema.parse(data);
  } catch (error) {
    console.log("API_ROUTE_ERROR: ", error);

    throw error;
  }
}
