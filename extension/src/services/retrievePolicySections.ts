import type { Section } from "../types/section";

export async function retrievePolicySections(
  question: string,
  documentId: string,
): Promise<Section[]> {
  const clerkToken: { token: string | null } = await chrome.runtime.sendMessage(
    {
      action: "get-clerkToken",
    },
  );

  if (!clerkToken?.token) {
    throw new Error("No Clerk token available");
  }

  const policySections = await chrome.runtime.sendMessage({
    action: "retrieve-policy-sections",
    clerkToken: clerkToken.token,
    question,
    documentId,
  });

  if (!Array.isArray(policySections)) {
    throw new Error("Failed to retrieve policy sections");
  }

  return policySections as Section[];
}
