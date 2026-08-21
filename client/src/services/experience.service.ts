import apiClient from "../api/client";
import type {
  CreateExperiencePayload,
  ExperienceListResponse,
  ExperienceResponse,
  UpdateExperiencePayload,
} from "../types/experience";

const EXPERIENCE_ENDPOINT = "/experience";

/**
 * Get all public experience entries.
 */
export const getExperiences = async () => {
  const response =
    await apiClient.get<ExperienceListResponse>(EXPERIENCE_ENDPOINT);

  return response.data.data;
};

/**
 * Create a new experience entry.
 *
 * Protected backend endpoint.
 */
export const createExperience = async (
  payload: CreateExperiencePayload
) => {
  const response = await apiClient.post<ExperienceResponse>(
    EXPERIENCE_ENDPOINT,
    payload
  );

  return response.data.data;
};

/**
 * Update an existing experience entry.
 *
 * Protected backend endpoint.
 */
export const updateExperience = async (
  id: string,
  payload: UpdateExperiencePayload
) => {
  const response = await apiClient.patch<ExperienceResponse>(
    `${EXPERIENCE_ENDPOINT}/${id}`,
    payload
  );

  return response.data.data;
};

/**
 * Delete an experience entry.
 *
 * Protected backend endpoint.
 */
export const deleteExperience = async (id: string) => {
  await apiClient.delete(`${EXPERIENCE_ENDPOINT}/${id}`);
};