import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import technologyService from "../services/technology.service";

import type {
  CreateTechnologyPayload,
  UpdateTechnologyPayload,
} from "../types/technology";

const TECHNOLOGIES_QUERY_KEY = ["technologies"];

export const useTechnologies = () => {
  return useQuery({
    queryKey: TECHNOLOGIES_QUERY_KEY,
    queryFn: technologyService.getTechnologies,
  });
};

export const useCreateTechnology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateTechnologyPayload
    ) => technologyService.createTechnology(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: TECHNOLOGIES_QUERY_KEY,
      });
    },
  });
};

interface UpdateTechnologyVariables {
  id: string;
  payload: UpdateTechnologyPayload;
}

export const useUpdateTechnology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateTechnologyVariables) =>
      technologyService.updateTechnology(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: TECHNOLOGIES_QUERY_KEY,
      });
    },
  });
};

export const useDeleteTechnology = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      technologyService.deleteTechnology(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: TECHNOLOGIES_QUERY_KEY,
      });
    },
  });
};