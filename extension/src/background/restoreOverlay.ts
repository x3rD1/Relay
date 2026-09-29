import { sendMessageToTab } from "../utils/sendMessageToTab";

export async function restoreOverlayOnContentReady(
  sender: chrome.runtime.MessageSender,
) {
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
