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
    chrome.tabs.query({ url: "https://example.com/*" }, (tabs) => {
      const tab = tabs[0];
      if (!tab.id) return;

      chrome.tabs.sendMessage(tab.id, message, (response) => {
        const { lastError: err } = chrome.runtime;
        if (err) {
          sendResponse(`Error: ${err.message}`);
          return;
        }
        sendResponse(response);
      });
    });

    return true;
  },
);
