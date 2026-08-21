import apiClient from "../api/client";

import type {
  SiteSettings,
  SiteSettingsApiResponse,
  UpdateSiteSettingsPayload,
} from "../types/site-settings";

const getSiteSettings = async (): Promise<SiteSettings> => {
  const response = await apiClient.get<
    SiteSettingsApiResponse<SiteSettings>
  >("/site-settings");

  return response.data.data;
};

const updateSiteSettings = async (
  payload: UpdateSiteSettingsPayload
): Promise<SiteSettings> => {
  const response = await apiClient.patch<
    SiteSettingsApiResponse<SiteSettings>
  >("/site-settings", payload);

  return response.data.data;
};

const uploadProfileImage = async (
  file: File
): Promise<SiteSettings> => {
  const formData = new FormData();

  // Must match: imageUpload.single("file")
  formData.append("file", file);

  const response = await apiClient.post<
    SiteSettingsApiResponse<SiteSettings>
  >("/site-settings/profile-image", formData);

  return response.data.data;
};

const deleteProfileImage = async (): Promise<SiteSettings> => {
  const response = await apiClient.delete<
    SiteSettingsApiResponse<SiteSettings>
  >("/site-settings/profile-image");

  return response.data.data;
};

const uploadResume = async (
  file: File
): Promise<SiteSettings> => {
  const formData = new FormData();

  // Must match: pdfUpload.single("file")
  formData.append("file", file);

  const response = await apiClient.post<
    SiteSettingsApiResponse<SiteSettings>
  >("/site-settings/resume", formData);

  return response.data.data;
};

const deleteResume = async (): Promise<SiteSettings> => {
  const response = await apiClient.delete<
    SiteSettingsApiResponse<SiteSettings>
  >("/site-settings/resume");

  return response.data.data;
};

export default {
  getSiteSettings,
  updateSiteSettings,

  uploadProfileImage,
  deleteProfileImage,

  uploadResume,
  deleteResume,
};