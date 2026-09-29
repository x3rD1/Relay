import audioProcessorUrl from "./audioProcessor.ts?url";
import { closeDeepgram } from "./deepgram";

let stream: MediaStream | null = null;

export const preRollBuffer: Int16Array[] = [];

type ChromeTabCaptureConstraints = MediaTrackConstraints & {
  mandatory: {
    chromeMediaSource: "tab";
    chromeMediaSourceId: string;
  };
};

export async function startStream(streamId: string) {
  const audio: ChromeTabCaptureConstraints = {
    mandatory: {
      chromeMediaSource: "tab",
      chromeMediaSourceId: streamId,
    },
  };

  stream = await navigator.mediaDevices.getUserMedia({
    audio,
    video: false,
  });

  await playAudioBackToSpeaker(stream);

  return stream;
}

async function playAudioBackToSpeaker(stream: MediaStream) {
  const output = new AudioContext();
  const source = output.createMediaStreamSource(stream);
  source.connect(output.destination);
}

export async function startAudioProcessor(
  stream: MediaStream,
  onPcmChunk: (chunk: Int16Array) => void,
) {
  const context = new AudioContext({ sampleRate: 16000 });
  console.log("AUDIO SAMPLE RATE:", context.sampleRate);

  await context.audioWorklet.addModule(audioProcessorUrl);

  const source = context.createMediaStreamSource(stream);
  const processor = new AudioWorkletNode(context, "audio-processor");

  processor.port.addEventListener("message", (event) => {
    const chunk = event.data as Int16Array;

    onPcmChunk(chunk);
  });
  processor.port.start();

  const gain = context.createGain();
  gain.gain.value = 0;

  source.connect(processor);
  processor.connect(gain);
  gain.connect(context.destination);

  return { context, processor };
}

export async function stopStream() {
  if (stream === null) return;

  const currentStream = stream;

  currentStream.getTracks().forEach((track) => track.stop());

  stream = null;

  await closeDeepgram();

  console.log("close Deepgram stream");
}
