import type { Message } from "../types/messages";
import { getTempToken } from "../utils/getTempToken";
import {
  preRollBuffer,
  startAudioProcessor,
  startStream,
  stopStream,
} from "./audioSession";
import { connectToDeepgram } from "./deepgram";
import { sendTranscript } from "./transcript";
import { startVAD } from "./vad";

let isSpeaking = false;

chrome.runtime.sendMessage({
  action: "offscreen-ready",
});

chrome.runtime.onMessage.addListener(async (message: Message) => {
  if (message.action === "consume-stream") {
    const stream = await startStream(message.streamId!);

    // Create a temporary Deepgram token
    const token = await getTempToken();
    // Connect to Deepgram's WebSocket using token and get its reference
    const socket = await connectToDeepgram(token, sendTranscript);

    const handlePcmChunk = (chunk: Int16Array) => {
      if (isSpeaking) {
        socket.send(chunk.buffer as ArrayBuffer);
      } else {
        if (preRollBuffer.length === 5) {
          preRollBuffer.shift();
        }

        preRollBuffer.push(chunk);
      }
    };

    await startAudioProcessor(stream, handlePcmChunk);

    const onSpeechStart = () => {
      isSpeaking = true;

      for (const chunk of preRollBuffer) {
        socket.send(chunk.buffer as ArrayBuffer);
      }

      preRollBuffer.length = 0;
    };

    const onVADMisfire = () => {
      isSpeaking = false;
      preRollBuffer.length = 0;
    };

    const onSpeechEnd = () => {
      isSpeaking = false;
      console.log("SPEECH END");
    };

    await startVAD(stream, onSpeechStart, onVADMisfire, onSpeechEnd);
  }

  if (message.action === "stop-capture") {
    await stopStream();

    // Notify the service worker that media cleanup is complete
    chrome.runtime.sendMessage({ action: "close-offscreen" });
  }
});
