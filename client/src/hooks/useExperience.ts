import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createExperience,
  deleteExperience,
  getExperiences,
  updateExperience,
} from "../services/experience.service";

import type {
  CreateExperiencePayload,
  UpdateExperiencePayload,
} from "../types/experience";

export const experienceKeys = {
  all: ["experience"] as const,
  list: () => [...experienceKeys.all, "list"] as const,
};

/**
 * Fetch experience entries.
 */
export const useExperiences = () => {
  return useQuery({
    queryKey: experienceKeys.list(),
    queryFn: getExperiences,
  });
};

/**
 * Create experience.
 */
export const useCreateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExperiencePayload) =>
      createExperience(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: experienceKeys.all,
      });
    },
  });
};

/**
 * Update experience.
 */
export const useUpdateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateExperiencePayload;
    }) => updateExperience(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: experienceKeys.all,
      });
    },
  });
};

/**
 * Delete experience.
 */
export const useDeleteExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: experienceKeys.all,
      });
    },
  });
};