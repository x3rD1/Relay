import { createRoot, type Root } from "react-dom/client";
import Overlay from "./components/Overlay";

let rootOverlay: Root | null = null;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "show-overlay") {
    const body = document.body;
    const overlay = document.createElement("div");
    overlay.className = "reoverlay";

    if (body.querySelector(".reoverlay")) {
      sendResponse("Overlay already exists");
      return;
    }

    body.appendChild(overlay);

    const root = createRoot(overlay);
    root.render(<Overlay />);

    rootOverlay = root;

    sendResponse("Overlay has been added");
  }

  if (message.action === "remove-overlay") {
    rootOverlay?.unmount();
    rootOverlay = null;

    document.body.querySelector(".reoverlay")?.remove();

    sendResponse("Overlay has been removed");
  }
});
