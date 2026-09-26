import type { Message } from "../types/messages";
import { getActiveTab } from "../utils/getActiveTab";

export function setupTabCapture() {
  let pendingStreamId: string | null = null;

  chrome.runtime.onMessage.addListener(async (message: Message) => {
    if (message.action === "start-capture") {
      const tab = await getActiveTab();

      if (!tab) {
        console.error("No active tab");
        return;
      }

      const streamId = await chrome.tabCapture.getMediaStreamId({
        targetTabId: tab.id,
      });

      pendingStreamId = streamId;

      try {
        const contexts = await chrome.runtime.getContexts({
          contextTypes: ["OFFSCREEN_DOCUMENT"],
        });

        if (contexts.length === 0) {
          await chrome.offscreen.createDocument({
            url: "src/offscreen/offscreen.html",
            reasons: ["USER_MEDIA"],
            justification: "Capture audio from the target tab",
          });
        } else {
          await chrome.runtime.sendMessage({
            action: "consume-stream",
            streamId: pendingStreamId,
          });
        }
      } catch (error) {
        console.error("OFFSCREEN SETUP FAILED:", error);
      }
    }

    if (message.action === "offscreen-ready") {
      if (pendingStreamId === null) return;

      await chrome.runtime.sendMessage({
        action: "consume-stream",
        streamId: pendingStreamId,
      });

      pendingStreamId = null;
    }
  });
}
