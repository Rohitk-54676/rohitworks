import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import socialLinkService from "../services/social-link.service";

import type {
  CreateSocialLinkPayload,
  UpdateSocialLinkPayload,
} from "../types/social-link";

const SOCIAL_LINKS_QUERY_KEY = [
  "social-links",
  "admin",
];

export const useSocialLinks = () => {
  return useQuery({
    queryKey: SOCIAL_LINKS_QUERY_KEY,
    queryFn: () =>
      socialLinkService.getSocialLinks(true),
  });
};

export const useCreateSocialLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateSocialLinkPayload
    ) =>
      socialLinkService.createSocialLink(
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["social-links"],
      });
    },
  });
};

interface UpdateSocialLinkVariables {
  id: string;
  payload: UpdateSocialLinkPayload;
}

export const useUpdateSocialLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateSocialLinkVariables) =>
      socialLinkService.updateSocialLink(
        id,
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["social-links"],
      });
    },
  });
};

export const useDeleteSocialLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      socialLinkService.deleteSocialLink(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["social-links"],
      });
    },
  });
};
/**
 * Public-facing variant — active links only, for the homepage/footer.
 * Deliberately separate from useSocialLinks() above (which fetches
 * includeInactive=true for the admin panel) so a disabled link can
 * never leak onto the public site.
 */
export const usePublicSocialLinks = () => {
  return useQuery({
    queryKey: ["social-links", "public"],
    queryFn: () => socialLinkService.getSocialLinks(false),
  });
};