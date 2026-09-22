import { getTabByUrl, sendMessageToTab } from "./utils/sendMessageToTab";

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === "content-ready") {
    const isListening = await chrome.storage.local.get("listening");
    if (!isListening.listening) return;

    if (sender.tab?.id == null) {
      return { success: false, error: "Failed to query the specified tab" };
    }

    sendMessageToTab(sender.tab.id, { action: "show-overlay" }); // TODO: Might throw an error need to catch
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
