const TYPESAFE_API_URL = process.env.TYPESAFE_API;
const API_KEY = process.env.JEV_API_KEY;

const JEV_MODEL = "jev-latest";

export async function analyzeTranscript(
  transcript: string,
  activeWorkflow: string,
) {
  if (!TYPESAFE_API_URL)
    throw new Error("Configuration Error: TYPESAFE_API is not defined");
  if (!API_KEY)
    throw new Error("Configuration Error: JEV_API_KEY is not defined");

  console.log("TRANSCRIPT:", transcript);
  try {
    const response = await fetch(TYPESAFE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: JEV_MODEL,
        state: transcript,
        questions: {
          topic: {
            type: "choice",
            instructions: `
            Current workflow: ${activeWorkflow}
            Determine which workflow this message belongs to.
            If there is an active workflow, treat messages that answer, provide information requested by, 
            or otherwise continue the current workflow as belonging to that workflow, 
            even if the message itself does not mention the workflow topic.
            Only classify the message as "other" when it does not continue the current workflow and 
            does not introduce a recognizable different workflow.`,
            criteria: {
              pools: "There is an issue with the pool",
              trees: "There is an issue with the christmas tree",
              refund: "Customer wants a refund.",
              other: "This is just a normal conversation",
            },
          },

          is_topic_change: {
            type: "noul",
            instructions: `
            Current workflow: ${activeWorkflow}
            Does this message introduce a new customer-service issue/topic that is different from the current workflow?
            `,
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
