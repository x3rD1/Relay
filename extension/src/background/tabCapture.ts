import type { Message, SendResponse } from "../types/messages";
import { getActiveTab } from "../utils/getActiveTab";

type PendingCapture = {
  streamId: string;
  clerkToken: string;
};

export function setupTabCapture() {
  let pendingCapture: PendingCapture | null = null;

  let pendingSendResponse: ((response: SendResponse) => void) | null = null;

  let isStarting = false;

  chrome.runtime.onMessage.addListener(
    (
      message: Message,
      _sender,
      sendResponse: (response: SendResponse) => void,
    ) => {
      if (message.action === "start-capture") {
        // Prevents another start capture request to run
        if (isStarting) {
          sendResponse({
            ok: false,
            error: "Capture is already starting",
          });
          return;
        }

        isStarting = true;

        // Save the original popup response callback.
        pendingSendResponse = sendResponse;

        (async () => {
          try {
            const tab = await getActiveTab();

            if (!tab) {
              console.error("No active tab");
              sendResponse({ ok: false, error: "Failed to start capture" });
              return;
            }

            const streamId = await chrome.tabCapture.getMediaStreamId({
              targetTabId: tab.id,
            });

            pendingCapture = {
              streamId,
              clerkToken: message.clerkToken,
            };

            const contexts = await chrome.runtime.getContexts({
              contextTypes: ["OFFSCREEN_DOCUMENT"],
            });

            if (contexts.length === 0) {
              // This creates an Offscreen document which triggers "offscreen-ready" action.
              await chrome.offscreen.createDocument({
                url: "src/offscreen/offscreen.html",
                reasons: ["USER_MEDIA"],
                justification: "Capture audio from the target tab",
              });

              return;
            }

            /* 
              The code block below runs only when Offscreen document already exists.
              This is a fallback or an edge case scenario.
            */

            const response: SendResponse = await chrome.runtime.sendMessage({
              action: "consume-stream",
              streamId,
              clerkToken: message.clerkToken,
            });

            isStarting = false;

            // Update isCapturing status based on the response.ok
            await chrome.storage.local.set({ isCapturing: response.ok });

            pendingSendResponse?.(response);
            pendingSendResponse = null;
            pendingCapture = null;
          } catch (error) {
            console.error("OFFSCREEN SETUP FAILED:", error);

            isStarting = false;

            await chrome.storage.local.set({ isCapturing: false });

            pendingSendResponse?.({
              ok: false,
              error: "Failed to start capture",
            });

            pendingSendResponse = null;
            pendingCapture = null;
          }
        })();

        return true; // Keep the channel open
      }

      if (message.action === "offscreen-ready") {
        (async () => {
          if (!pendingCapture || !pendingSendResponse) return;

          try {
            const response: SendResponse = await chrome.runtime.sendMessage({
              action: "consume-stream",
              streamId: pendingCapture.streamId,
              clerkToken: pendingCapture.clerkToken,
            });

            // Update isCapturing status based on the response.ok
            await chrome.storage.local.set({ isCapturing: response.ok });

            pendingSendResponse(response);
          } catch (error) {
            console.error("CONSUME STREAM FAILED:", error);

            await chrome.storage.local.set({ isCapturing: false });

            pendingSendResponse({
              ok: false,
              error: "Failed to start capture",
            });
          } finally {
            isStarting = false;
            pendingCapture = null;
            pendingSendResponse = null;
          }
        })();
      }

      if (message.action === "stop-capture") {
        (async () => {
          try {
            const response: SendResponse = await chrome.runtime.sendMessage({
              action: "stop-stream",
            });

            if (!response.ok) {
              // Set status to false indicating stop capture
              await chrome.storage.local.set({ isCapturing: false });

              sendResponse(response);
              return;
            }

            await chrome.offscreen.closeDocument();
            console.log("Offscreen document closed successfully.");

            // Set status to false indicating stop capture
            await chrome.storage.local.set({ isCapturing: false });

            sendResponse({ ok: true });
          } catch (error) {
            console.error("Failed to stop capture", error);

            await chrome.storage.local.set({ isCapturing: true });

            sendResponse({ ok: false, error: "Failed to stop capture" });
          }
        })();

        return true; // Keep the channel open
      }
    },
  );
}
