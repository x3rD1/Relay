import { useEffect, useState } from "react";
import type { Message } from "../types/messages";

export function useUpdateResponse() {
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    const handleResponse = (message: Message) => {
      if (message.action === "update-response") {
        if (message.response == null) return;

        setResponse(message.response);
      }
    };

    chrome.runtime.onMessage.addListener(handleResponse);

    return () => chrome.runtime.onMessage.removeListener(handleResponse);
  }, []);

  return response;
}
