export async function getTabByUrl(
  tabUrl: string,
): Promise<chrome.tabs.Tab | null> {
  try {
    const tabs = await chrome.tabs.query({ url: tabUrl });
    return tabs[0] || null;
  } catch (error) {
    console.error(`Failed to query tab for URL ${tabUrl}:`, error);
    return null;
  }
}

export async function sendMessageToTab(
  tabId: number,
  message: Record<string, unknown>,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const response = await chrome.tabs.sendMessage(tabId, message);
    return { success: true, data: response?.data ?? response };
  } catch (error) {
    console.error("Message passing failed:", error);
    return {
      success: false,
      error: "Unable to reach content script",
    };
  }
}
