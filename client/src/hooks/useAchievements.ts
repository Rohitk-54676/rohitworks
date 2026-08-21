import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import achievementService from "../services/achievement.service";

import type {
  CreateAchievementPayload,
  UpdateAchievementPayload,
} from "../types/achievement";

const ACHIEVEMENTS_QUERY_KEY = [
  "achievements",
];

export const useAchievements = () => {
  return useQuery({
    queryKey: ACHIEVEMENTS_QUERY_KEY,
    queryFn: achievementService.getAchievements,
  });
};

export const useCreateAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateAchievementPayload
    ) =>
      achievementService.createAchievement(
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ACHIEVEMENTS_QUERY_KEY,
      });
    },
  });
};

interface UpdateAchievementVariables {
  id: string;
  payload: UpdateAchievementPayload;
}

export const useUpdateAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateAchievementVariables) =>
      achievementService.updateAchievement(
        id,
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ACHIEVEMENTS_QUERY_KEY,
      });
    },
  });
};

export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      achievementService.deleteAchievement(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ACHIEVEMENTS_QUERY_KEY,
      });
    },
  });
};

interface UploadAchievementMediaVariables {
  id: string;
  file: File;
}

export const useUploadAchievementMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      file,
    }: UploadAchievementMediaVariables) =>
      achievementService.uploadAchievementMedia(
        id,
        file
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ACHIEVEMENTS_QUERY_KEY,
      });
    },
  });
};

export const useDeleteAchievementMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      achievementService.deleteAchievementMedia(
        id
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ACHIEVEMENTS_QUERY_KEY,
      });
    },
  });
};