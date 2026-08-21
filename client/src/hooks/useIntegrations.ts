import { useQuery } from "@tanstack/react-query";

import integrationsService from "../services/integrations.service";

export const useGithubProfile = () => {
  return useQuery({
    queryKey: ["integrations", "github", "profile"],
    queryFn: integrationsService.getGithubProfile,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGithubRepositories = () => {
  return useQuery({
    queryKey: ["integrations", "github", "repositories"],
    queryFn: integrationsService.getGithubRepositories,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGithubContributions = () => {
  return useQuery({
    queryKey: ["integrations", "github", "contributions"],
    queryFn: integrationsService.getGithubContributions,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLeetCodeProfile = () => {
  return useQuery({
    queryKey: ["integrations", "leetcode", "profile"],
    queryFn: integrationsService.getLeetCodeProfile,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLeetCodeProblemStats = () => {
  return useQuery({
    queryKey: ["integrations", "leetcode", "problems"],
    queryFn: integrationsService.getLeetCodeProblemStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLeetCodeActivity = () => {
  return useQuery({
    queryKey: ["integrations", "leetcode", "activity"],
    queryFn: integrationsService.getLeetCodeActivity,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLeetCodeLanguages = () => {
  return useQuery({
    queryKey: ["integrations", "leetcode", "languages"],
    queryFn: integrationsService.getLeetCodeLanguages,
    staleTime: 5 * 60 * 1000,
  });
};