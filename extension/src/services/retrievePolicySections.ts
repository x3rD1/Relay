import type { Section } from "../types/section";

export async function retrievePolicySections(
  question: string,
  documentId: string,
): Promise<Section[]> {
  const response = await chrome.runtime.sendMessage({
    action: "retrieve-policy-sections",
    question,
    documentId,
  });

  if (!response.ok) {
    throw new Error(response.error);
  }

  return response.sections as Section[];
}
