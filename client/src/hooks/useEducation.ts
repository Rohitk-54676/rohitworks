import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import educationService from "../services/education.service";

import type {
  CreateEducationPayload,
  UpdateEducationPayload,
} from "../types/education";

const EDUCATION_QUERY_KEY = ["education"];

export const useEducation = () => {
  return useQuery({
    queryKey: EDUCATION_QUERY_KEY,
    queryFn: educationService.getEducation,
  });
};

export const useCreateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateEducationPayload
    ) => educationService.createEducation(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: EDUCATION_QUERY_KEY,
      });
    },
  });
};

interface UpdateEducationVariables {
  id: string;
  payload: UpdateEducationPayload;
}

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateEducationVariables) =>
      educationService.updateEducation(
        id,
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: EDUCATION_QUERY_KEY,
      });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      educationService.deleteEducation(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: EDUCATION_QUERY_KEY,
      });
    },
  });
};