import type { Section } from "../types/section";

export interface PolicyMatchesResponse {
  policies: { id: string; name: string }[];
}

export async function fetchPolicyMatches(transcript: string) {
  const response = await fetch("http://localhost:3000/api/transcript", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.error);
  }

  const data: PolicyMatchesResponse = await response.json();

  return data;
}

export async function fetchRelevantSections(
  question: string,
  documentId: string,
  clerkToken: string,
) {
  const response = await fetch("http://localhost:3000/api/retrieve-sections", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript: question, documentId }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.error);
  }

  const data: Section[] = await response.json();

  return data;
}
