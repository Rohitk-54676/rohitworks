import { useMutation } from "@tanstack/react-query";

import contactService from "../services/contact.service";
import type { ContactFormData } from "../types/contact";

export const useContact = () => {
  return useMutation({
    mutationFn: (payload: ContactFormData) =>
      contactService.sendMessage(payload),
  });
};