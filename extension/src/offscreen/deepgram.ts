import { fetchPolicyMatches } from "./transcript";

let completedTurns: string[] = [];
let latestTranscript = "";
let currentTurnIndex: number | null = null;
export let fullTranscript: string;

let socket: WebSocket | null = null;

let keepAliveTimer: ReturnType<typeof setInterval> | null = null;

export function connectToDeepgram(token: string): Promise<WebSocket> {
  const ws = new WebSocket(
    "wss://api.deepgram.com/v2/listen?model=flux-general-en&encoding=linear16&sample_rate=16000",
    ["bearer", token],
  );

  socket = ws;

  return new Promise((resolve, reject) => {
    ws.addEventListener("open", () => {
      console.log("DEEPGRAM CONNECTED");
      startKeepAlive(ws);

      resolve(ws);
    });

    ws.addEventListener("error", (event) => {
      console.error("DEEPGRAM ERROR:", event);
      reject(new Error("Failed to connect to Deepgram"));
    });

    ws.addEventListener("close", (event) => {
      console.log("DEEPGRAM CLOSED:", event.code, event.reason);
    });

    ws.addEventListener("message", async (event) => {
      try {
        if (typeof event.data !== "string") return;

        const message = JSON.parse(event.data);

        if (message.type !== "TurnInfo") return;

        if (currentTurnIndex !== message.turn_index) {
          currentTurnIndex = message.turn_index;
          latestTranscript = "";
        }

        if (message.event === "Update" || message.event === "StartOfTurn") {
          latestTranscript = message.transcript;
        }

        if (message.event === "EndOfTurn") {
          latestTranscript = message.transcript;

          if (latestTranscript.trim()) {
            completedTurns.push(latestTranscript);
          }

          latestTranscript = "";
        }

        fullTranscript = [...completedTurns, latestTranscript]
          .filter(Boolean)
          .join(" ");
      } catch (parseError) {
        console.warn(
          "Failed to parse non-JSON metadata payload from Deepgram stream:",
          parseError,
        );
      }
    });
  });
}

export function closeDeepgram(): Promise<void> {
  return new Promise((resolve) => {
    if (keepAliveTimer !== null) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }

    if (!socket || socket.readyState === WebSocket.CLOSED) {
      resolve();
      return;
    }

    socket.addEventListener(
      "close",
      () => {
        socket = null;
        resolve();
      },
      { once: true },
    );

    socket.send(JSON.stringify({ type: "CloseStream" }));
  });
}

function startKeepAlive(socket: WebSocket) {
  keepAliveTimer = setInterval(() => {
    const silence = new Int16Array(1);
    socket.send(silence.buffer);
  }, 1000 * 8);
}

export async function processLatestTranscript(
  fullTranscript: string,
  interactionId: string,
) {
  try {
    const response = await fetchPolicyMatches(fullTranscript);

    chrome.runtime.sendMessage({
      action: "get-policies",
      interactionId,
      policies: response.policies,
    });
  } catch (error) {
    console.error(error);
    chrome.runtime.sendMessage({
      action: "policies-error",
      interactionId,
    });
  }
}

export function sendTranscriptToUI(
  fullTranscript: string,
  interactionId: string,
) {
  chrome.runtime.sendMessage({
    action: "get-transcript",
    interactionId,
    transcript: fullTranscript,
  });
}

export function clearFullTranscript() {
  fullTranscript = "";
  completedTurns = [];
}
