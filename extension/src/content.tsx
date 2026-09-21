import { createRoot, type Root } from "react-dom/client";
import Overlay from "./components/Overlay";
import { injectOverlay, isOverlayRemoved } from "./utils/uiManager";

let rootOverlay: Root | null = null;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "show-overlay") {
    const overlay = injectOverlay();
    if (!overlay) {
      sendResponse({
        success: false,
        error: "Element with a class name reoverlay already exist",
      });
      return;
    }

    const root = createRoot(overlay);
    root.render(<Overlay />);

    rootOverlay = root;

    sendResponse({ success: true, data: "Overlay has been created" });
  }

  if (message.action === "remove-overlay") {
    if (!isOverlayRemoved()) {
      sendResponse({
        success: false,
        error:
          "Unable to remove overlay. Element with class name reoverlay does not exist",
      });
      return;
    }

    rootOverlay?.unmount();
    rootOverlay = null;

    sendResponse({ success: true, data: "Overlay has been removed" });
  }
});
