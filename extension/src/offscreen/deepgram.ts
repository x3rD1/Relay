let socket: WebSocket | null = null;

export function connectToDeepgram(
  token: string,
  sendTranscript: (transcript: string) => Promise<void>,
): Promise<WebSocket> {
  const ws = new WebSocket(
    "wss://api.deepgram.com/v2/listen?model=flux-general-en",
    ["bearer", token],
  );

  socket = ws;

  return new Promise((resolve, reject) => {
    ws.addEventListener("open", () => {
      console.log("DEEPGRAM CONNECTED");
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

        if (message.event === "EndOfTurn") {
          try {
            await sendTranscript(message.transcript);
          } catch (error) {
            console.error("Failed to send transcript:", error);
          }
        }
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
