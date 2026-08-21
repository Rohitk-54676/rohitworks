import apiClient from "../api/client";

import type {
  Project,
  ProjectListResponse,
  ProjectResponse,
} from "../types/project";

export interface CreateProjectPayload {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;

  github_url?: string | null;
  live_url?: string | null;

  featured: boolean;
  status: Project["status"];

  start_date?: string | null;
  end_date?: string | null;

  problem?: string | null;
  solution?: string | null;
  features?: string | null;
  architecture?: string | null;
  challenges?: string | null;
  results?: string | null;
  lessons_learned?: string | null;

  display_order: number;

  technology_ids: string[];
}

export type UpdateProjectPayload =
  Partial<CreateProjectPayload>;

export interface ProjectThumbnailUploadResponse {
  id: string;
  thumbnail_url: string;
  thumbnail_public_id: string;
}

export interface ProjectThumbnailDeleteResponse {
  id: string;
  thumbnail_deleted: boolean;
  cloudinary_public_id?: string;
}

const projectsService = {
  /*
   * Get all projects
   */

  async getProjects(): Promise<Project[]> {
    const response =
      await apiClient.get<ProjectListResponse>(
        "/projects",
      );

    return response.data.data;
  },

  /*
   * Get project by slug
   */

  async getProjectBySlug(
    slug: string,
  ): Promise<Project> {
    const response =
      await apiClient.get<ProjectResponse>(
        `/projects/${slug}`,
      );

    return response.data.data;
  },

  /*
   * Create project
   */

  async createProject(
    payload: CreateProjectPayload,
  ): Promise<Project> {
    const response =
      await apiClient.post<ProjectResponse>(
        "/projects",
        payload,
      );

    return response.data.data;
  },

  /*
   * Update project
   */

  async updateProject(
    id: string,
    payload: UpdateProjectPayload,
  ): Promise<Project> {
    const response =
      await apiClient.patch<ProjectResponse>(
        `/projects/${id}`,
        payload,
      );

    return response.data.data;
  },

  /*
   * Delete project
   */

  async deleteProject(
    id: string,
  ): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  /*
   * Upload / replace project thumbnail
   *
   * Backend:
   * POST /api/projects/:id/thumbnail
   *
   * Multipart field:
   * file
   */

  async uploadProjectThumbnail(
    id: string,
    file: File,
  ): Promise<ProjectThumbnailUploadResponse> {
    const formData = new FormData();

    formData.append("file", file);

    const response =
      await apiClient.post<{
        success: boolean;
        data: ProjectThumbnailUploadResponse;
      }>(
        `/projects/${id}/thumbnail`,
        formData,
      );

    return response.data.data;
  },

  /*
   * Delete project thumbnail
   *
   * Backend:
   * DELETE /api/projects/:id/thumbnail
   */

  async deleteProjectThumbnail(
    id: string,
  ): Promise<ProjectThumbnailDeleteResponse> {
    const response =
      await apiClient.delete<{
        success: boolean;
        data: ProjectThumbnailDeleteResponse;
      }>(
        `/projects/${id}/thumbnail`,
      );

    return response.data.data;
  },
};

export default projectsService;