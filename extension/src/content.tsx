import { createRoot, type Root } from "react-dom/client";
import Overlay from "./components/overlay/Overlay";
import { injectOverlay } from "./utils/uiManager";
import { notifyContentReady } from "./utils/contentReady";
import type { Message } from "./types/messages";
import overlayCss from "./components/overlay/Overlay.module.css?inline";
import conversationFeedCss from "./components/conversation/ConversationFeed.module.css?inline";
import emptyStateCss from "./components/conversation/EmptyState.module.css?inline";

const combinedOverlayCss = [
  overlayCss,
  conversationFeedCss,
  emptyStateCss,
].join("\n");

let rootOverlay: Root | null = null;

chrome.runtime.onMessage.addListener(async (message: Message) => {
  switch (message.action) {
    case "show-overlay": {
      const shadowRoot = injectOverlay();

      if (!shadowRoot.querySelector("#overlay-styles")) {
        const style = document.createElement("style");
        style.id = "overlay-styles";
        style.textContent = combinedOverlayCss;
        shadowRoot.prepend(style);
      }

      let mountPoint = shadowRoot.querySelector<HTMLDivElement>("#app-root");

      if (!mountPoint) {
        mountPoint = document.createElement("div");
        mountPoint.id = "app-root";
        mountPoint.style.cssText =
          "position: fixed; inset: 0; pointer-events: none;";

        shadowRoot.appendChild(mountPoint);
      }

      if (!rootOverlay) {
        rootOverlay = createRoot(mountPoint);
      }

      rootOverlay.render(<Overlay />);

      await chrome.storage.local.set({ listening: true });
      return { success: true, data: "Overlay has been created" };
    }

    case "remove-overlay": {
      const host = document.querySelector("#relay-overlay");

      if (!host) {
        return {
          success: false,
          error: "Overlay does not exist",
        };
      }

      rootOverlay?.unmount();
      rootOverlay = null;

      await chrome.storage.local.set({ listening: false });
      return { success: true, data: "Overlay has been removed" };
    }

    default:
      return { success: false, error: "Unknown action" };
  }
});

// Sends message to service-worker with an action type "content-ready"
notifyContentReady();
