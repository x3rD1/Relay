import { createRoot, type Root } from "react-dom/client";
import Overlay from "./components/Overlay";
import { injectOverlay, isOverlayRemoved } from "./utils/uiManager";
import { notifyContentReady } from "./utils/contentReady";

let rootOverlay: Root | null = null;

chrome.runtime.onMessage.addListener(async (message) => {
  switch (message.action) {
    case "show-overlay": {
      const overlay = injectOverlay();
      if (!overlay) {
        return {
          success: false,
          error: "Element with a class name reoverlay already exist",
        };
      }

      const root = createRoot(overlay);
      root.render(<Overlay />);

      rootOverlay = root;

      await chrome.storage.local.set({ listening: true });
      return { success: true, data: "Overlay has been created" };
    }

    case "remove-overlay": {
      if (!isOverlayRemoved()) {
        return {
          success: false,
          error:
            "Unable to remove overlay. Element with class name reoverlay does not exist",
        };
      }

      rootOverlay?.unmount();
      rootOverlay = null;

      await chrome.storage.local.set({ listening: false });
      return { success: true, data: "Overlay has been removed" };
    }

    default:
      break;
  }
});

// Sends message to service-worker with an action type "content-ready"
notifyContentReady();
