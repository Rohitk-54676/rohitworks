import apiClient from "../api/client";

import type {
  ChatResponse,
  SendChatMessagePayload,
} from "../types/chat";

const sendMessage = async (
  payload: SendChatMessagePayload
): Promise<string> => {
  const response = await apiClient.post<ChatResponse>(
    "/chat",
    payload
  );

  return response.data.data.message;
};

export default {
  sendMessage,
};