import { useEffect, useState } from "react";
import type { Message, Policy } from "../types/messages";

export interface Interaction {
  id: string;
  transcript: string;
  policies: Policy[];
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
          },
        ]);
      }

      if (message.action === "get-policies") {
        if (message.policies == null) return;
        const { policies } = message;

        setInteractions((prev) =>
          prev.map((interaction) =>
            interaction.id === message.interactionId
              ? { ...interaction, policies }
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
