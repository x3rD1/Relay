const BODY = document.body;

export function injectOverlay(): ShadowRoot {
  let host = BODY.querySelector<HTMLDivElement>("#relay-overlay");

  if (!host) {
    host = document.createElement("div");
    host.id = "relay-overlay";
    BODY.appendChild(host);
  }

  Object.assign(host.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "99999",
  });

  return host.shadowRoot ?? host.attachShadow({ mode: "open" });
}
