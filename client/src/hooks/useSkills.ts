import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import skillService from "../services/skill.service";

import type {
  CreateSkillPayload,
  UpdateSkillPayload,
} from "../types/skill";

const SKILLS_QUERY_KEY = ["skills"];

export const useSkills = () => {
  return useQuery({
    queryKey: SKILLS_QUERY_KEY,
    queryFn: skillService.getSkills,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSkillPayload) =>
      skillService.createSkill(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: SKILLS_QUERY_KEY,
      });
    },
  });
};

interface UpdateSkillVariables {
  id: string;
  payload: UpdateSkillPayload;
}

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateSkillVariables) =>
      skillService.updateSkill(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: SKILLS_QUERY_KEY,
      });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      skillService.deleteSkill(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: SKILLS_QUERY_KEY,
      });
    },
  });
};