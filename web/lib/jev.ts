const TYPESAFE_API_URL = process.env.TYPESAFE_API;
const API_KEY = process.env.JEV_API_KEY;

const JEV_MODEL = "jev-latest";

export async function analyzeTranscript(
  transcripts: string[],
  activeWorkflow: string,
) {
  if (!TYPESAFE_API_URL)
    throw new Error("Configuration Error: TYPESAFE_API is not defined");
  if (!API_KEY)
    throw new Error("Configuration Error: JEV_API_KEY is not defined");

  console.log("TRANSCRIPT:", transcripts[transcripts.length - 1]);
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
          topic: {
            type: "choice",
            instructions: `
            Current workflow: ${activeWorkflow}
            Determine which workflow this message belongs to.
            If there is an active workflow, treat messages that answer, provide information requested by, 
            or otherwise continue the current workflow as belonging to that workflow, 
            even if the message itself does not mention the workflow topic.

            What workflow does the customer's latest request belong to?
            `,
            criteria: {
              pools:
                "The customer needs help with a pool-related issue or request.",
              trees:
                "The customer needs help with a Christmas-tree-related issue or request.",
              refund:
                "The customer is requesting a refund, return, cancellation, or reversal of a purchase.",
              general:
                "The customer is asking for general information or assistance that is not specific to the other available workflows.",
            },
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

    return data;
  } catch (error) {
    console.log("API_ROUTE_ERROR: ", error);

    throw error;
  }
}
