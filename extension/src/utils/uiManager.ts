const BODY = document.body;

export function injectOverlay() {
  if (BODY.querySelector(".reoverlay")) return null;

  const overlay = document.createElement("div");
  overlay.className = "reoverlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "99999";

  BODY.appendChild(overlay);

  return overlay;
}

export function isOverlayRemoved() {
  if (!BODY.querySelector(".reoverlay")) return false;

  BODY.querySelector(".reoverlay")?.remove();

  return true;
}
