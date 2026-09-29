import { restoreOverlayOnContentReady } from "./background/restoreOverlay";
import { setupTabCapture } from "./background/tabCapture";
import type { Message, MsgResponse } from "./types/messages";
import { getTabByUrl, sendMessageToTab } from "./utils/sendMessageToTab";

chrome.runtime.onMessage.addListener(async (message: Message, sender) => {
  if (message.action === "content-ready") {
    // Keep the overlay persistent on refresh
    await restoreOverlayOnContentReady(sender);
  }

  if (message.action === "close-offscreen") {
    console.log("closing offscreen");
    chrome.offscreen.closeDocument();
  }
});

chrome.runtime.onMessageExternal.addListener(
  async (message: Message): Promise<MsgResponse | undefined> => {
    let { tabId } = (await chrome.storage.local.get("tabId")) as {
      tabId: number;
    };

    if (tabId == null) {
      const tab = await getTabByUrl("https://*.youtube.com/watch*");
      if (!(tab && tab.id)) {
        return {
          success: false,
          error: "Failed to query the specified tab",
        };
      }

      tabId = tab.id;
      chrome.storage.local.set({ tabId });
    }

    const response = await sendMessageToTab(tabId, message);
    if (response.error) {
      return { success: false, error: response.error };
    }

    return response;
  },
);

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const targetTab = await chrome.storage.local.get("tabId");
  if (targetTab.tabId !== tabId) return;

  chrome.storage.local.set({ tabId: null });
});

// Register tab capture listener
setupTabCapture();
