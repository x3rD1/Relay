type Action =
  | "show-overlay"
  | "remove-overlay"
  | "content-ready"
  | "get-transcript"
  | "get-policies"
  | "start-capture"
  | "stop-capture"
  | "consume-stream"
  | "offscreen-ready"
  | "close-offscreen";

export type Message = {
  action: Action;
  interactionId?: string;
  transcript?: string;
  policies?: Policy[];
  streamId?: string;
};

export type MsgResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export type Policy = {
  id: string;
  name: string;
};
