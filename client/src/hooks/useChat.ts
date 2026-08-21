import { useMutation } from "@tanstack/react-query";

import chatService from "../services/chat.service";
import type { SendChatMessagePayload } from "../types/chat";

export const useChat = () => {
  return useMutation({
    mutationFn: (payload: SendChatMessagePayload) =>
      chatService.sendMessage(payload),
  });
};