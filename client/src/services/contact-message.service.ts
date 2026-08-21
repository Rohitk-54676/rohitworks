import apiClient from "../api/client";

import type {
  ContactMessage,
  ContactMessageApiResponse,
  UpdateContactMessagePayload,
} from "../types/contact-message";

const getContactMessages = async (
  unreadOnly = false
): Promise<ContactMessage[]> => {
  const response = await apiClient.get<
    ContactMessageApiResponse<ContactMessage[]>
  >("/contact", {
    params: unreadOnly
      ? { unreadOnly: true }
      : undefined,
  });

  return response.data.data;
};

const updateContactMessage = async (
  id: string,
  payload: UpdateContactMessagePayload
): Promise<ContactMessage> => {
  const response = await apiClient.patch<
    ContactMessageApiResponse<ContactMessage>
  >(`/contact/${id}`, payload);

  return response.data.data;
};

const deleteContactMessage = async (
  id: string
): Promise<{ id: string }> => {
  const response = await apiClient.delete<
    ContactMessageApiResponse<{ id: string }>
  >(`/contact/${id}`);

  return response.data.data;
};

export default {
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
};