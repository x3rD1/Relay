export type Message =
  | { action: "show-overlay" }
  | { action: "remove-overlay" }
  | { action: "content-ready" }
  | { action: "start-capture" }
  | { action: "stop-capture" }
  | { action: "get-capture-status" }
  | { action: "capture-ended" }
  | { action: "stop-stream" }
  | { action: "offscreen-ready" }
  | { action: "get-clerkToken" }
  | { action: "consume-stream"; streamId: string; clerkToken: string }
  | { action: "get-transcript"; interactionId: string; transcript: string }
  | { action: "get-policies"; interactionId: string; policies: Policy[] }
  | { action: "policies-error"; interactionId: string }
  | { action: "retrieve-policy-sections"; question: string; documentId: string }
  | { action: "generate-response"; question: string; sectionId: string };

export type MsgResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export type Policy = {
  id: string;
  name: string;
};

export type SendResponse =
  | {
      ok: true;
    }
  | { ok: false; error: string };
