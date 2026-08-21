import apiClient from "../api/client";

import type {
  CreateEducationPayload,
  Education,
  EducationApiResponse,
  UpdateEducationPayload,
} from "../types/education";

const getEducation = async (): Promise<Education[]> => {
  const response =
    await apiClient.get<EducationApiResponse<Education[]>>(
      "/education"
    );

  return response.data.data;
};

const createEducation = async (
  payload: CreateEducationPayload
): Promise<Education> => {
  const response =
    await apiClient.post<EducationApiResponse<Education>>(
      "/education",
      payload
    );

  return response.data.data;
};

const updateEducation = async (
  id: string,
  payload: UpdateEducationPayload
): Promise<Education> => {
  const response =
    await apiClient.patch<EducationApiResponse<Education>>(
      `/education/${id}`,
      payload
    );

  return response.data.data;
};

const deleteEducation = async (
  id: string
): Promise<{ id: string }> => {
  const response =
    await apiClient.delete<
      EducationApiResponse<{ id: string }>
    >(`/education/${id}`);

  return response.data.data;
};

export default {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};