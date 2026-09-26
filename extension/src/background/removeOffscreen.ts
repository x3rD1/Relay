import type { Message } from "../types/messages";

export function closeOffscreen() {
  chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.action !== "close-offscreen") return;
    console.log("closing offscreen");
    chrome.offscreen.closeDocument();
  });
}
