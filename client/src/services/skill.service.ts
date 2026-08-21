import apiClient from "../api/client";

import type {
  CreateSkillPayload,
  Skill,
  SkillApiResponse,
  UpdateSkillPayload,
} from "../types/skill";

const getSkills = async (): Promise<Skill[]> => {
  const response = await apiClient.get<
    SkillApiResponse<Skill[]>
  >("/skills");

  return response.data.data;
};

const createSkill = async (
  payload: CreateSkillPayload
): Promise<Skill> => {
  const response = await apiClient.post<
    SkillApiResponse<Skill>
  >("/skills", payload);

  return response.data.data;
};

const updateSkill = async (
  id: string,
  payload: UpdateSkillPayload
): Promise<Skill> => {
  const response = await apiClient.patch<
    SkillApiResponse<Skill>
  >(`/skills/${id}`, payload);

  return response.data.data;
};

const deleteSkill = async (
  id: string
): Promise<{ id: string }> => {
  const response = await apiClient.delete<
    SkillApiResponse<{ id: string }>
  >(`/skills/${id}`);

  return response.data.data;
};

export default {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};