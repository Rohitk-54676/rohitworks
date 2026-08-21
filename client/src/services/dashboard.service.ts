import apiClient from "../api/client";

import type {
  DashboardContactMessage,
  DashboardExperience,
  DashboardOverview,
  DashboardProject,
  DashboardSkill,
} from "../types/dashboard";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    const [
      projectsResponse,
      skillsResponse,
      experienceResponse,
      messagesResponse,
    ] = await Promise.all([
      apiClient.get<ApiSuccessResponse<DashboardProject[]>>(
        "/projects",
      ),

      apiClient.get<ApiSuccessResponse<DashboardSkill[]>>(
        "/skills",
      ),

      apiClient.get<ApiSuccessResponse<DashboardExperience[]>>(
        "/experience",
      ),

      apiClient.get<ApiSuccessResponse<DashboardContactMessage[]>>(
        "/contact",
      ),
    ]);

    return {
      projects: projectsResponse.data.data,
      skills: skillsResponse.data.data,
      experience: experienceResponse.data.data,
      messages: messagesResponse.data.data,
    };
  },
};

export default dashboardService;