import type { Message } from "../types/messages";
import { getTempToken } from "../utils/getTempToken";
import { closeDeepgram, connectToDeepgram } from "./deepgram";
import { sendTranscript } from "./transcript";

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

    const token = await getTempToken();

    const socket = await connectToDeepgram(token, sendTranscript);

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("dataavailable", (event: BlobEvent) => {
      socket.send(event.data);
    });

    recorder.start(1000);
  }

  if (message.action === "stop-capture") {
    if (recorder === null || stream === null) return;

    const currentRecorder = recorder;
    const currentStream = stream;

    const recorderStopped = new Promise<void>((resolve) => {
      currentRecorder.addEventListener("stop", () => resolve(), { once: true });
    });

    currentRecorder.stop();
    currentStream.getTracks().forEach((track) => track.stop());

    await recorderStopped;

    recorder = null;
    stream = null;

    console.log("recorder stopped");

    await closeDeepgram();

    console.log("close Deepgram stream");

    // Notify the service worker that media cleanup is complete
    chrome.runtime.sendMessage({ action: "close-offscreen" });
  }
});
