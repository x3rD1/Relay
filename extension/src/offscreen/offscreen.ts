import type { Message, SendResponse } from "../types/messages";
import { getTempToken } from "../utils/getTempToken";
import {
  isStopping,
  preRollBuffer,
  startAudioProcessor,
  startStream,
  stopStream,
} from "./audioSession";
import {
  clearFullTranscript,
  connectToDeepgram,
  fullTranscript,
  processLatestTranscript,
  sendTranscriptToUI,
} from "./deepgram";
import { startVAD } from "./vad";

let audioProcessor: Awaited<ReturnType<typeof startAudioProcessor>> | null =
  null;
let vad: Awaited<ReturnType<typeof startVAD>> | null = null;

let isSpeaking = false;

chrome.runtime.sendMessage({
  action: "offscreen-ready",
});

chrome.runtime.onMessage.addListener(
  (
    message: Message,
    _sender,
    sendResponse: (response: SendResponse) => void,
  ) => {
    if (message.action === "consume-stream") {
      (async () => {
        let stream: MediaStream | null = null;

        try {
          stream = await startStream(message.streamId);

          // Checks whether stream ended unexpectedly and cleans up audio resources
          stream.getTracks().forEach((track) => {
            track.addEventListener("ended", async () => {
              if (isStopping) return;

              await cleanupAudioResources();

              chrome.runtime.sendMessage({ action: "capture-ended" });
            });
          });

          // Create a temporary Deepgram token
          const token = await getTempToken(message.clerkToken);
          // Connect to Deepgram's WebSocket using token and get its reference
          const socket = await connectToDeepgram(token);

          // Callback on what to do with the pcm chunk
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

          // Get raw PCM audio
          audioProcessor = await startAudioProcessor(stream, handlePcmChunk);

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

          const onSpeechEnd = async () => {
            isSpeaking = false;

            const interactionId = crypto.randomUUID();
            sendTranscriptToUI(fullTranscript, interactionId);

            // Get suggested policies then send it to extension
            await processLatestTranscript(fullTranscript, interactionId);

            clearFullTranscript();
            console.log("SPEECH END");
          };

          // Decide when to send chunk.buffer to the socket
          vad = await startVAD(
            stream,
            onSpeechStart,
            onVADMisfire,
            onSpeechEnd,
          );

          sendResponse({ ok: true });
        } catch (error) {
          console.error("Offscreen consume-stream action failed ", error);

          // Stop the tab's audio capture if startup failed.
          stream?.getTracks().forEach((track) => track.stop());

          sendResponse({
            ok: false,
            error: "Failed to start capture",
          });
        }
      })();

      return true; // Keep the channel open
    }

    if (message.action === "stop-stream") {
      (async () => {
        try {
          await stopStream();

          sendResponse({ ok: true });
        } catch (error) {
          console.error("Failed to stop stream", error);
          sendResponse({ ok: false, error: "Failed to stop capture" });
        }
      })();

      return true; // Keep the channel open
    }
  },
);

async function cleanupAudioResources() {
  if (vad) {
    vad.destroy();
    vad = null;
  }

  if (audioProcessor) {
    audioProcessor.processor.disconnect();
    audioProcessor.processor.port.close();

    await audioProcessor.context.close();

    audioProcessor = null;
  }
}
