export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface SendChatMessagePayload {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    message: string;
  };
}