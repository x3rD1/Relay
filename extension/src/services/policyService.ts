import type { Section } from "../types/section";

export interface PolicyMatchesResponse {
  policies: { id: string; name: string }[];
}

export async function fetchPolicyMatches(
  transcript: string,
  clerkToken: string,
) {
  const response = await fetch("http://localhost:3000/api/transcript", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${clerkToken}`,
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
  transcript: string,
  documentId: string,
  clerkToken: string,
) {
  const response = await fetch("http://localhost:3000/api/retrieve-sections", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript, documentId }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.error);
  }

  const sections: Section[] = await response.json();

  return sections;
}

export async function generateResponse(
  question: string,
  sectionId: string,
  clerkToken: string,
) {
  const response = await fetch("http://localhost:3000/api/generate-response", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript: question, sectionId }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.error);
  }

  const responseData: string = await response.json();

  return responseData;
}
