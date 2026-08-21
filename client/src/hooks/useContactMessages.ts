import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import contactMessageService from "../services/contact-message.service";

import type {
  UpdateContactMessagePayload,
} from "../types/contact-message";

export const CONTACT_MESSAGES_QUERY_KEY = [
  "contact-messages",
];

export const useContactMessages = (
  unreadOnly = false
) => {
  return useQuery({
    queryKey: [
      ...CONTACT_MESSAGES_QUERY_KEY,
      { unreadOnly },
    ],

    queryFn: () =>
      contactMessageService.getContactMessages(
        unreadOnly
      ),
  });
};

interface UpdateContactMessageVariables {
  id: string;
  payload: UpdateContactMessagePayload;
}

export const useUpdateContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateContactMessageVariables) =>
      contactMessageService.updateContactMessage(
        id,
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          CONTACT_MESSAGES_QUERY_KEY,
      });
    },
  });
};

export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      contactMessageService.deleteContactMessage(
        id
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          CONTACT_MESSAGES_QUERY_KEY,
      });
    },
  });
};