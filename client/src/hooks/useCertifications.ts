import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import certificationService from "../services/certification.service";

import type {
  CreateCertificationPayload,
  UpdateCertificationPayload,
} from "../types/certification";

const CERTIFICATIONS_QUERY_KEY = [
  "certifications",
];

export const useCertifications = () => {
  return useQuery({
    queryKey: CERTIFICATIONS_QUERY_KEY,
    queryFn: certificationService.getCertifications,
  });
};

export const useCreateCertification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateCertificationPayload
    ) =>
      certificationService.createCertification(
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CERTIFICATIONS_QUERY_KEY,
      });
    },
  });
};

interface UpdateCertificationVariables {
  id: string;
  payload: UpdateCertificationPayload;
}

export const useUpdateCertification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateCertificationVariables) =>
      certificationService.updateCertification(
        id,
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CERTIFICATIONS_QUERY_KEY,
      });
    },
  });
};

export const useDeleteCertification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      certificationService.deleteCertification(
        id
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CERTIFICATIONS_QUERY_KEY,
      });
    },
  });
};

interface UploadCertificationMediaVariables {
  id: string;
  file: File;
}

export const useUploadCertificationMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      file,
    }: UploadCertificationMediaVariables) =>
      certificationService.uploadCertificationMedia(
        id,
        file
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CERTIFICATIONS_QUERY_KEY,
      });
    },
  });
};

export const useDeleteCertificationMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      certificationService.deleteCertificationMedia(
        id
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CERTIFICATIONS_QUERY_KEY,
      });
    },
  });
};