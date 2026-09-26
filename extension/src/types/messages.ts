type Action =
  | "show-overlay"
  | "remove-overlay"
  | "content-ready"
  | "update-response"
  | "start-capture"
  | "stop-capture"
  | "consume-stream"
  | "offscreen-ready"
  | "close-offscreen";

export type Message = {
  action: Action;
  response?: string;
  streamId?: string;
};

export type MsgResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
};
