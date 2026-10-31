import { getClerkToken } from "../auth/auth";

export function generateClerkToken() {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action !== "get-clerkToken") return;

    (async () => {
      try {
        const token = await getClerkToken();
        sendResponse({ token: token ?? null });
      } catch (error) {
        console.error("[Background] getClerkToken failed:", error);
        sendResponse({ token: null });
      }
    })();

    return true; // Keep the channel open
  });
}
