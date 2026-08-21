import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import siteSettingsService from "../services/site-settings.service";

import type {
  UpdateSiteSettingsPayload,
} from "../types/site-settings";

export const SITE_SETTINGS_QUERY_KEY = [
  "site-settings",
];

export const useSiteSettings = () => {
  return useQuery({
    queryKey:
      SITE_SETTINGS_QUERY_KEY,

    queryFn: () =>
      siteSettingsService.getSiteSettings(),
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: UpdateSiteSettingsPayload
    ) =>
      siteSettingsService.updateSiteSettings(
        payload
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          SITE_SETTINGS_QUERY_KEY,
      });
    },
  });
};

export const useUploadProfileImage = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      siteSettingsService.uploadProfileImage(
        file
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          SITE_SETTINGS_QUERY_KEY,
      });
    },
  });
};

export const useDeleteProfileImage = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      siteSettingsService.deleteProfileImage(),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          SITE_SETTINGS_QUERY_KEY,
      });
    },
  });
};

export const useUploadResume = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      siteSettingsService.uploadResume(
        file
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          SITE_SETTINGS_QUERY_KEY,
      });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      siteSettingsService.deleteResume(),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          SITE_SETTINGS_QUERY_KEY,
      });
    },
  });
};