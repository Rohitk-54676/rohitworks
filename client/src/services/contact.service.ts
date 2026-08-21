import apiClient from "../api/client";

import type {
  ContactApiResponse,
  ContactFormData,
} from "../types/contact";

const sendMessage = async (
  payload: ContactFormData
): Promise<unknown> => {
  const response = await apiClient.post<
    ContactApiResponse
  >("/contact", payload);

  return response.data.data;
};

export default {
  sendMessage,
};