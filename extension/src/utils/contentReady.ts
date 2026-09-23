const isPrerendering = (
  document as Document & {
    prerendering: boolean;
  }
).prerendering;

export function notifyContentReady() {
  if (isPrerendering) {
    document.addEventListener(
      "prerenderingchange",
      () => chrome.runtime.sendMessage({ action: "content-ready" }),
      { once: true },
    );
  } else {
    chrome.runtime.sendMessage({ action: "content-ready" });
  }
}
