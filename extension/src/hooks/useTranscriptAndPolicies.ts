import { useEffect, useState } from "react";
import type { Message, Policy } from "../types/messages";

type PolicyStatus = "loading" | "success" | "error";

export interface Interaction {
  id: string;
  transcript: string;
  policies: Policy[];
  policyStatus: PolicyStatus;
}

export function useTranscriptAndPolicies() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    const handleResponse = (message: Message) => {
      if (message.action === "get-transcript") {
        if (message.transcript == null || message.interactionId == null) return;
        const { interactionId, transcript } = message;

        setInteractions((prev) => [
          ...prev,
          {
            id: interactionId,
            transcript,
            policies: [],
            policyStatus: "loading",
          },
        ]);
      }

      if (message.action === "get-policies") {
        if (message.policies == null) return;
        const { interactionId, policies } = message;

        setInteractions((prev) =>
          prev.map((interaction) =>
            interaction.id === interactionId
              ? { ...interaction, policies, policyStatus: "success" }
              : interaction,
          ),
        );
      }

      if (message.action === "policies-error") {
        if (message.interactionId == null) return;

        setInteractions((prev) =>
          prev.map((interaction) =>
            interaction.id === message.interactionId
              ? { ...interaction, policyStatus: "error" }
              : interaction,
          ),
        );
      }
    };

    chrome.runtime.onMessage.addListener(handleResponse);

    return () => chrome.runtime.onMessage.removeListener(handleResponse);
  }, []);

  return interactions;
}
