chrome.runtime.onMessage.addListener((message) => {
  if (message.action !== "hello") {
    console.log("Error, wrong action");
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, message);
    }
  });
});

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    chrome.tabs.query({ url: "https://example.com/*" }, async (tabs) => {
      const tab = tabs[0];
      if (!(tab && tab.id)) {
        sendResponse({
          success: false,
          error: "Specified tab does not exist",
        });
        return;
      }

      try {
        const res = await chrome.tabs.sendMessage(tab.id, message);

        if (res.error) {
          sendResponse({ success: false, error: res.error });
          return;
        }

        sendResponse({ success: true, data: res.data });
      } catch (error) {
        console.error(error);
        sendResponse({
          success: false,
          error: "Unable to reach content script",
        });
      }
    });

    return true;
  },
);
