import apiClient from "../api/client";

import type {
  ApiResponse,
  GithubContributions,
  GithubProfile,
  GithubRepository,
  LeetCodeActivity,
  LeetCodeLanguage,
  LeetCodeProblemStats,
  LeetCodeProfile,
} from "../types/integrations";

const integrationsService = {
  async getGithubProfile(): Promise<GithubProfile> {
    const response =
      await apiClient.get<ApiResponse<GithubProfile>>(
        "/integrations/github/profile"
      );

    return response.data.data;
  },

  async getGithubRepositories(): Promise<GithubRepository[]> {
    const response =
      await apiClient.get<ApiResponse<GithubRepository[]>>(
        "/integrations/github/repositories"
      );

    return response.data.data;
  },

  async getGithubContributions(): Promise<GithubContributions> {
    const response =
      await apiClient.get<ApiResponse<GithubContributions>>(
        "/integrations/github/contributions"
      );

    return response.data.data;
  },

  async getLeetCodeProfile(): Promise<LeetCodeProfile> {
    const response =
      await apiClient.get<ApiResponse<LeetCodeProfile>>(
        "/integrations/leetcode/profile"
      );

    return response.data.data;
  },

  async getLeetCodeProblemStats(): Promise<LeetCodeProblemStats> {
    const response =
      await apiClient.get<ApiResponse<LeetCodeProblemStats>>(
        "/integrations/leetcode/problems"
      );

    return response.data.data;
  },

  async getLeetCodeActivity(): Promise<LeetCodeActivity> {
    const response =
      await apiClient.get<ApiResponse<LeetCodeActivity>>(
        "/integrations/leetcode/activity"
      );

    return response.data.data;
  },

  async getLeetCodeLanguages(): Promise<LeetCodeLanguage[]> {
    const response =
      await apiClient.get<ApiResponse<LeetCodeLanguage[]>>(
        "/integrations/leetcode/languages"
      );

    return response.data.data;
  },
};

export default integrationsService;