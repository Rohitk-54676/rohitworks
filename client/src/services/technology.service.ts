import apiClient from "../api/client";

import type {
  CreateTechnologyPayload,
  Technology,
  TechnologyApiResponse,
  UpdateTechnologyPayload,
} from "../types/technology";

const getTechnologies = async (): Promise<Technology[]> => {
  const response = await apiClient.get<
    TechnologyApiResponse<Technology[]>
  >("/technologies");

  return response.data.data;
};

const createTechnology = async (
  payload: CreateTechnologyPayload
): Promise<Technology> => {
  const response = await apiClient.post<
    TechnologyApiResponse<Technology>
  >("/technologies", payload);

  return response.data.data;
};

const updateTechnology = async (
  id: string,
  payload: UpdateTechnologyPayload
): Promise<Technology> => {
  const response = await apiClient.patch<
    TechnologyApiResponse<Technology>
  >(`/technologies/${id}`, payload);

  return response.data.data;
};

const deleteTechnology = async (
  id: string
): Promise<{ id: string }> => {
  const response = await apiClient.delete<
    TechnologyApiResponse<{ id: string }>
  >(`/technologies/${id}`);

  return response.data.data;
};

export default {
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
};