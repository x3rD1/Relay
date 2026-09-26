import type { Message } from "../types/messages";

type ChromeTabCaptureConstraints = MediaTrackConstraints & {
  mandatory: {
    chromeMediaSource: "tab";
    chromeMediaSourceId: string;
  };
};

let stream: MediaStream | null = null;
let recorder: MediaRecorder | null = null;

chrome.runtime.sendMessage({
  action: "offscreen-ready",
});

chrome.runtime.onMessage.addListener(async (message: Message) => {
  if (message.action === "consume-stream") {
    const audio: ChromeTabCaptureConstraints = {
      mandatory: {
        chromeMediaSource: "tab",
        chromeMediaSourceId: message.streamId!,
      },
    };

    stream = await navigator.mediaDevices.getUserMedia({
      audio,
      video: false,
    });

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("dataavailable", (event: BlobEvent) => {});

    recorder.start(1000);
  }

  if (message.action === "stop-capture") {
    if (recorder === null || stream === null) return;

    recorder.stop();
    stream.getTracks().forEach((track) => track.stop());

    recorder = null;
    stream = null;

    console.log("recorder stopped");
    // Notify the service worker that media cleanup is complete
    chrome.runtime.sendMessage({ action: "close-offscreen" });
  }
});
