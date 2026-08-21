import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import projectsService, {
  type CreateProjectPayload,
  type UpdateProjectPayload,
} from "../services/projects.service";

export const projectsQueryKey = ["projects"];

/*
 * Get all projects
 */

export function useProjects() {
  return useQuery({
    queryKey: projectsQueryKey,
    queryFn: projectsService.getProjects,
    staleTime: 30_000,
  });
}

/*
 * Get project by slug
 */

export function useProjectBySlug(
  slug: string,
) {
  return useQuery({
    queryKey: ["projects", slug],
    queryFn: () =>
      projectsService.getProjectBySlug(slug),
    enabled: Boolean(slug),
  });
}

/*
 * Create project
 */

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateProjectPayload,
    ) =>
      projectsService.createProject(
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectsQueryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "overview"],
      });
    },
  });
}

/*
 * Update project
 */

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProjectPayload;
    }) =>
      projectsService.updateProject(
        id,
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectsQueryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "overview"],
      });
    },
  });
}

/*
 * Delete project
 */

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      projectsService.deleteProject(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectsQueryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "overview"],
      });
    },
  });
}

/*
 * Upload / replace project thumbnail
 */

export function useUploadProjectThumbnail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      file,
    }: {
      id: string;
      file: File;
    }) =>
      projectsService.uploadProjectThumbnail(
        id,
        file,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectsQueryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "overview"],
      });
    },
  });
}

/*
 * Delete project thumbnail
 */

export function useDeleteProjectThumbnail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      projectsService.deleteProjectThumbnail(
        id,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectsQueryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "overview"],
      });
    },
  });
}