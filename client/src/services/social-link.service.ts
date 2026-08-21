import apiClient from "../api/client";

import type {
  CreateSocialLinkPayload,
  SocialLink,
  SocialLinkApiResponse,
  UpdateSocialLinkPayload,
} from "../types/social-link";

const getSocialLinks = async (
  includeInactive = false
): Promise<SocialLink[]> => {
  const response = await apiClient.get<
    SocialLinkApiResponse<SocialLink[]>
  >("/social-links", {
    params: includeInactive
      ? { includeInactive: true }
      : undefined,
  });

  return response.data.data;
};

const createSocialLink = async (
  payload: CreateSocialLinkPayload
): Promise<SocialLink> => {
  const response = await apiClient.post<
    SocialLinkApiResponse<SocialLink>
  >("/social-links", payload);

  return response.data.data;
};

const updateSocialLink = async (
  id: string,
  payload: UpdateSocialLinkPayload
): Promise<SocialLink> => {
  const response = await apiClient.patch<
    SocialLinkApiResponse<SocialLink>
  >(`/social-links/${id}`, payload);

  return response.data.data;
};

const deleteSocialLink = async (
  id: string
): Promise<{ id: string }> => {
  const response = await apiClient.delete<
    SocialLinkApiResponse<{ id: string }>
  >(`/social-links/${id}`);

  return response.data.data;
};

export default {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
};