import apiClient from "../api/client";

import type {
  Achievement,
  AchievementApiResponse,
  AchievementMediaResponse,
  CreateAchievementPayload,
  DeleteAchievementMediaResponse,
  UpdateAchievementPayload,
} from "../types/achievement";

const getAchievements = async (): Promise<
  Achievement[]
> => {
  const response = await apiClient.get<
    AchievementApiResponse<Achievement[]>
  >("/achievements");

  return response.data.data;
};

const createAchievement = async (
  payload: CreateAchievementPayload
): Promise<Achievement> => {
  const response = await apiClient.post<
    AchievementApiResponse<Achievement>
  >("/achievements", payload);

  return response.data.data;
};

const updateAchievement = async (
  id: string,
  payload: UpdateAchievementPayload
): Promise<Achievement> => {
  const response = await apiClient.patch<
    AchievementApiResponse<Achievement>
  >(`/achievements/${id}`, payload);

  return response.data.data;
};

const deleteAchievement = async (
  id: string
): Promise<{ id: string }> => {
  const response = await apiClient.delete<
    AchievementApiResponse<{ id: string }>
  >(`/achievements/${id}`);

  return response.data.data;
};

const uploadAchievementMedia = async (
  id: string,
  file: File
): Promise<AchievementMediaResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post<
    AchievementApiResponse<AchievementMediaResponse>
  >(
    `/achievements/${id}/media`,
    formData
  );

  return response.data.data;
};

const deleteAchievementMedia = async (
  id: string
): Promise<DeleteAchievementMediaResponse> => {
  const response = await apiClient.delete<
    AchievementApiResponse<DeleteAchievementMediaResponse>
  >(`/achievements/${id}/media`);

  return response.data.data;
};

export default {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  uploadAchievementMedia,
  deleteAchievementMedia,
};