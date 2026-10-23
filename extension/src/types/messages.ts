export type Message =
  | { action: "show-overlay" }
  | { action: "remove-overlay" }
  | { action: "content-ready" }
  | { action: "start-capture" }
  | { action: "stop-capture" }
  | { action: "offscreen-ready" }
  | { action: "close-offscreen" }
  | { action: "consume-stream"; streamId: string }
  | { action: "get-transcript"; interactionId: string; transcript: string }
  | { action: "get-policies"; interactionId: string; policies: Policy[] }
  | { action: "policies-error"; interactionId: string };

export type MsgResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export type Policy = {
  id: string;
  name: string;
};
