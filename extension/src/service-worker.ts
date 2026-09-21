import { getTabByUrl, sendMessageToTab } from "./utils/sendMessageToTab";

chrome.runtime.onMessageExternal.addListener(
  async (message, sender, sendResponse) => {
    const tab = await getTabByUrl("https://example.com/*");
    if (!(tab && tab.id)) {
      sendResponse({
        success: false,
        error: "Failed to query the specified tab",
      });
      return;
    }

    const response = await sendMessageToTab(tab.id, message);
    if (response.error) {
      sendResponse({ success: false, error: response.error });
      return;
    }

    sendResponse(response);

    return true;
  },
);
