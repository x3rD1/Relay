type Action = "show-overlay" | "remove-overlay" | "content-ready";

export type Message = {
  action: Action;
};

export type MsgResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
};
