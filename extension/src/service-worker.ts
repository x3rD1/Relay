import { getTabByUrl, sendMessageToTab } from "./utils/sendMessageToTab";

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === "content-ready") {
    if (sender.tab?.id == null) {
      return { success: false, error: "Failed to query the specified tab" };
    }

    const { listening, tabId } = (await chrome.storage.local.get([
      "listening",
      "tabId",
    ])) as { listening: boolean; tabId: number | null };
    if (!listening) return;

    if (tabId !== null && tabId !== sender.tab.id) {
      return;
    }

    if (tabId === null) {
      await chrome.storage.local.set({ tabId: sender.tab.id });
    }

    try {
      await sendMessageToTab(sender.tab.id, { action: "show-overlay" });
    } catch (err) {
      console.error(err);
      return { success: false, error: "Unable to restore overlay" };
    }
  }
});

chrome.runtime.onMessageExternal.addListener(async (message) => {
  let { tabId } = (await chrome.storage.local.get("tabId")) as {
    tabId: number;
  };

  if (tabId == null) {
    const tab = await getTabByUrl("https://example.com/*");
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
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const targetTab = await chrome.storage.local.get("tabId");
  if (targetTab.tabId !== tabId) return;

  chrome.storage.local.set({ tabId: null });
});
