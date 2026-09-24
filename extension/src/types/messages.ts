type Action =
  | "show-overlay"
  | "remove-overlay"
  | "content-ready"
  | "update-response";

export type Message = {
  action: Action;
  response?: string;
};

export type MsgResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
};
