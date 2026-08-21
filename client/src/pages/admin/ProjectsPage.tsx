import { useState } from "react";
import axios from "axios";
import {
  Pencil,
  Plus,
  Trash2,
  X,
  Upload,
} from "lucide-react";

import {
  useCreateProject,
  useDeleteProject,
  useDeleteProjectThumbnail,
  useProjects,
  useUpdateProject,
  useUploadProjectThumbnail,
} from "../../hooks/useProjects";

import type {
  Project,
  ProjectStatus,
} from "../../types/project";

import type { CreateProjectPayload } from "../../services/projects.service";

const initialForm: CreateProjectPayload = {
  title: "",
  slug: "",
  short_description: "",
  full_description: "",
  github_url: "",
  live_url: "",
  featured: false,
  status: "completed",
  start_date: null,
  end_date: null,
  problem: "",
  solution: "",
  features: "",
  architecture: "",
  challenges: "",
  results: "",
  lessons_learned: "",
  display_order: 0,
  technology_ids: [],
};

const MAX_THUMBNAIL_SIZE =
  5 * 1024 * 1024;

const ALLOWED_THUMBNAIL_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function ProjectsPage() {
  const {
    data: projects,
    isLoading,
    isError,
    refetch,
  } = useProjects();

  const createProject =
    useCreateProject();

  const updateProject =
    useUpdateProject();

  const deleteProject =
    useDeleteProject();

  const uploadThumbnail =
    useUploadProjectThumbnail();

  const deleteThumbnail =
    useDeleteProjectThumbnail();

  const [showForm, setShowForm] =
    useState(false);

  const [editingProjectId, setEditingProjectId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<CreateProjectPayload>({
      ...initialForm,
    });

  const [featuresText, setFeaturesText] =
    useState<string>("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [
    thumbnailUploadingId,
    setThumbnailUploadingId,
  ] = useState<string | null>(null);

  const [
    thumbnailDeletingId,
    setThumbnailDeletingId,
  ] = useState<string | null>(null);

  const isEditing =
    editingProjectId !== null;

  const isSubmitting =
    createProject.isPending ||
    updateProject.isPending;

  /*
   * Update form field
   */

  const updateField = <
    K extends keyof CreateProjectPayload,
  >(
    field: K,
    value: CreateProjectPayload[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
   * Open create form
   */

  const openCreateForm = () => {
    setEditingProjectId(null);

    setForm({
      ...initialForm,
    });

    setFeaturesText("");

    setShowForm(true);
  };

  /*
   * Normalize features.
   *
   * Backend stores features as a string.
   * This also safely handles an older
   * frontend Project type containing string[].
   */

  const normalizeFeatures = (
    value:
      | string
      | string[]
      | null
      | undefined,
  ): string => {
    if (Array.isArray(value)) {
      return value
        .map((feature) => feature.trim())
        .filter(Boolean)
        .join("\n");
    }

    return value ?? "";
  };

  /*
   * Open edit form
   */

  const openEditForm = (
    project: Project,
  ) => {
    const normalizedFeatures =
      normalizeFeatures(
        project.features,
      );

    setEditingProjectId(project.id);

    setForm({
      title: project.title,

      slug: project.slug,

      short_description:
        project.short_description,

      full_description:
        project.full_description ?? "",

      github_url:
        project.github_url ?? null,

      live_url:
        project.live_url ?? null,

      featured: Boolean(
        project.featured,
      ),

      status: project.status,

      start_date:
        project.start_date ?? null,

      end_date:
        project.end_date ?? null,

      problem:
        project.problem ?? "",

      solution:
        project.solution ?? "",

      features:
        normalizedFeatures,

      architecture:
        project.architecture ?? "",

      challenges:
        project.challenges ?? "",

      results:
        project.results ?? "",

      lessons_learned:
        project.lessons_learned ?? "",

      display_order:
        Number.isInteger(
          project.display_order,
        )
          ? project.display_order
          : 0,

      technology_ids:
        project.technologies?.map(
          (technology) =>
            technology.id,
        ) ?? [],
    });

    setFeaturesText(
      normalizedFeatures,
    );

    setShowForm(true);
  };

  /*
   * Close form
   */

  const closeForm = () => {
    if (isSubmitting) {
      return;
    }

    setShowForm(false);

    setEditingProjectId(null);

    setForm({
      ...initialForm,
    });

    setFeaturesText("");
  };

  /*
   * Create / update project
   */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      window.alert(
        "Project title is required.",
      );
      return;
    }

    if (!form.slug.trim()) {
      window.alert(
        "Project slug is required.",
      );
      return;
    }

    if (
      !form.short_description.trim()
    ) {
      window.alert(
        "Short description is required.",
      );
      return;
    }

    /*
     * Convert features textarea into
     * the string expected by backend.
     */

    const features = featuresText
      .split("\n")
      .map((feature) => feature.trim())
      .filter(Boolean)
      .join("\n");

    const payload: CreateProjectPayload = {
      title: form.title.trim(),

      slug: form.slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-"),

      short_description:
        form.short_description.trim(),

      full_description:
        form.full_description?.trim() ||
        "",

      github_url:
        form.github_url?.trim() ||
        null,

      live_url:
        form.live_url?.trim() ||
        null,

      featured: Boolean(
        form.featured,
      ),

      status: form.status,

      start_date:
        form.start_date || null,

      end_date:
        form.end_date || null,

      problem:
        form.problem?.trim() || "",

      solution:
        form.solution?.trim() || "",

      features,

      architecture:
        form.architecture?.trim() || "",

      challenges:
        form.challenges?.trim() || "",

      results:
        form.results?.trim() || "",

      lessons_learned:
        form.lessons_learned?.trim() ||
        "",

      display_order:
        Number.isInteger(
          form.display_order,
        )
          ? form.display_order
          : 0,

      technology_ids:
        Array.isArray(
          form.technology_ids,
        )
          ? form.technology_ids
          : [],
    };

    try {
      if (editingProjectId) {
        const result =
          await updateProject.mutateAsync({
            id: editingProjectId,
            payload,
          });

        console.log(
          "PROJECT UPDATED:",
          result,
        );

        window.alert(
          "Project updated successfully.",
        );
      } else {
        const result =
          await createProject.mutateAsync(
            payload,
          );

        console.log(
          "PROJECT CREATED:",
          result,
        );

        window.alert(
          "Project created successfully.",
        );
      }

      closeForm();
    } catch (error) {
      console.error(
        isEditing
          ? "FAILED TO UPDATE PROJECT:"
          : "FAILED TO CREATE PROJECT:",
        error,
      );

      if (
        axios.isAxiosError(error)
      ) {
        console.error(
          "HTTP STATUS:",
          error.response?.status,
        );

        console.error(
          "SERVER RESPONSE:",
          error.response?.data,
        );

        const responseData =
          error.response?.data;

        const message =
          responseData?.message ??
          "Request failed.";

        const errors =
          responseData?.errors;

        if (errors) {
          window.alert(
            `${
              isEditing
                ? "Update"
                : "Creation"
            } failed:\n\n${JSON.stringify(
              errors,
              null,
              2,
            )}`,
          );
        } else {
          window.alert(
            `${
              isEditing
                ? "Update"
                : "Creation"
            } failed:\n\n${message}`,
          );
        }
      } else {
        window.alert(
          `${
            isEditing
              ? "Update"
              : "Creation"
          } failed. Check the browser console.`,
        );
      }
    }
  };

  /*
   * Upload / replace thumbnail
   */

  const handleThumbnailUpload =
    async (
      projectId: string,
      file: File,
    ) => {
      if (
        !ALLOWED_THUMBNAIL_TYPES.includes(
          file.type,
        )
      ) {
        window.alert(
          "Invalid image type. Use JPEG, PNG, or WebP.",
        );
        return;
      }

      if (
        file.size >
        MAX_THUMBNAIL_SIZE
      ) {
        window.alert(
          "Image is too large. Maximum size is 5 MB.",
        );
        return;
      }

      try {
        setThumbnailUploadingId(
          projectId,
        );

        await uploadThumbnail.mutateAsync({
          id: projectId,
          file,
        });

        window.alert(
          "Thumbnail uploaded successfully.",
        );
      } catch (error) {
        console.error(
          "FAILED TO UPLOAD THUMBNAIL:",
          error,
        );

        if (
          axios.isAxiosError(error)
        ) {
          console.error(
            "THUMBNAIL STATUS:",
            error.response?.status,
          );

          console.error(
            "THUMBNAIL RESPONSE:",
            error.response?.data,
          );

          window.alert(
            error.response?.data
              ?.message ??
              "Failed to upload thumbnail.",
          );
        } else {
          window.alert(
            "Failed to upload thumbnail.",
          );
        }
      } finally {
        setThumbnailUploadingId(
          null,
        );
      }
    };

  /*
   * Delete thumbnail
   */

  const handleThumbnailDelete =
    async (projectId: string) => {
      const confirmed =
        window.confirm(
          "Remove this project's thumbnail?",
        );

      if (!confirmed) {
        return;
      }

      try {
        setThumbnailDeletingId(
          projectId,
        );

        await deleteThumbnail.mutateAsync(
          projectId,
        );

        window.alert(
          "Thumbnail removed successfully.",
        );
      } catch (error) {
        console.error(
          "FAILED TO DELETE THUMBNAIL:",
          error,
        );

        if (
          axios.isAxiosError(error)
        ) {
          console.error(
            "THUMBNAIL DELETE STATUS:",
            error.response?.status,
          );

          console.error(
            "THUMBNAIL DELETE RESPONSE:",
            error.response?.data,
          );

          window.alert(
            error.response?.data
              ?.message ??
              "Failed to remove thumbnail.",
          );
        } else {
          window.alert(
            "Failed to remove thumbnail.",
          );
        }
      } finally {
        setThumbnailDeletingId(
          null,
        );
      }
    };

  /*
   * Delete project
   */

  const handleDelete = async (
    id: string,
    title: string,
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteProject.mutateAsync(
        id,
      );

      window.alert(
        "Project deleted successfully.",
      );
    } catch (error) {
      console.error(
        "FAILED TO DELETE PROJECT:",
        error,
      );

      if (
        axios.isAxiosError(error)
      ) {
        console.error(
          "DELETE STATUS:",
          error.response?.status,
        );

        console.error(
          "DELETE RESPONSE:",
          error.response?.data,
        );

        window.alert(
          error.response?.data
            ?.message ??
            "Failed to delete project.",
        );
      } else {
        window.alert(
          "Failed to delete project.",
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * Loading
   */

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-32 animate-pulse rounded bg-slate-200" />

            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  /*
   * Error
   */

  if (isError || !projects) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Unable to load projects
        </h2>

        <p className="mt-1 text-sm text-red-700">
          Something went wrong while loading
          your projects.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Projects
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage the projects displayed
            on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Create / Edit Form */}

      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                {isEditing
                  ? "Edit Project"
                  : "Add Project"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isEditing
                  ? "Update your project information."
                  : "Add a new project to your portfolio."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={isSubmitting}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-5"
          >
            {/* Basic information */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Title
                </label>

                <input
                  value={form.title}
                  onChange={(event) =>
                    updateField(
                      "title",
                      event.target.value,
                    )
                  }
                  placeholder="Portfolio Website"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Slug
                </label>

                <input
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      event.target.value
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-",
                        ),
                    )
                  }
                  placeholder="portfolio-website"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Description */}

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Short Description
                </label>

                <textarea
                  value={
                    form.short_description
                  }
                  onChange={(event) =>
                    updateField(
                      "short_description",
                      event.target.value,
                    )
                  }
                  rows={3}
                  placeholder="A short description of the project."
                  className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Full Description
                </label>

                <textarea
                  value={
                    form.full_description ??
                    ""
                  }
                  onChange={(event) =>
                    updateField(
                      "full_description",
                      event.target.value,
                    )
                  }
                  rows={6}
                  placeholder="Detailed description of the project."
                  className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Status */}

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target
                        .value as ProjectStatus,
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                  <option value="planned">
                    Planned
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="archived">
                    Archived
                  </option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Display Order
                </label>

                <input
                  type="number"
                  min={0}
                  value={
                    form.display_order
                  }
                  onChange={(event) =>
                    updateField(
                      "display_order",
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <label className="flex items-center gap-3 self-end rounded-lg border border-slate-200 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={Boolean(
                    form.featured,
                  )}
                  onChange={(event) =>
                    updateField(
                      "featured",
                      event.target
                        .checked,
                    )
                  }
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-slate-700">
                  Featured project
                </span>
              </label>
            </div>

            {/* Links */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  GitHub URL
                </label>

                <input
                  type="url"
                  value={
                    form.github_url ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "github_url",
                      event.target.value,
                    )
                  }
                  placeholder="https://github.com/..."
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Live URL
                </label>

                <input
                  type="url"
                  value={
                    form.live_url ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "live_url",
                      event.target.value,
                    )
                  }
                  placeholder="https://..."
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Dates */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Start Date
                </label>

                <input
                  type="date"
                  value={
                    form.start_date ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "start_date",
                      event.target.value ||
                        null,
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  End Date
                </label>

                <input
                  type="date"
                  value={
                    form.end_date ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "end_date",
                      event.target.value ||
                        null,
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Case Study */}

            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-900">
                Case Study
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <textarea
                  value={
                    form.problem ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "problem",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Problem"
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />

                <textarea
                  value={
                    form.solution ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "solution",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Solution"
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />

                <textarea
                  value={
                    form.architecture ??
                    ""
                  }
                  onChange={(event) =>
                    updateField(
                      "architecture",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Architecture"
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />

                <textarea
                  value={
                    form.challenges ??
                    ""
                  }
                  onChange={(event) =>
                    updateField(
                      "challenges",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Challenges"
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />

                <textarea
                  value={
                    form.results ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "results",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Results"
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />

                <textarea
                  value={
                    form.lessons_learned ??
                    ""
                  }
                  onChange={(event) =>
                    updateField(
                      "lessons_learned",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Lessons learned"
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              {/* Features */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Features
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  Enter one feature per line.
                </p>

                <textarea
                  value={featuresText}
                  onChange={(event) =>
                    setFeaturesText(
                      event.target.value,
                    )
                  }
                  rows={5}
                  placeholder={
                    "JWT authentication\nAdmin dashboard\nContact management"
                  }
                  className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Form actions */}

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={closeForm}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Project"
                    : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project List */}

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Plus
              size={22}
              className="text-slate-500"
            />
          </div>

          <h2 className="mt-4 text-base font-semibold text-slate-900">
            No projects yet
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Add your first project to start
            building your portfolio content.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Thumbnail */}

              <div className="relative aspect-video overflow-hidden bg-slate-100">
                {project.thumbnail_url ? (
                  <img
                    src={
                      project.thumbnail_url
                    }
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Upload
                        size={24}
                        className="mx-auto text-slate-400"
                      />

                      <span className="mt-2 block text-sm text-slate-400">
                        No thumbnail
                      </span>
                    </div>
                  </div>
                )}

                {/* Thumbnail actions */}

                <div className="absolute bottom-3 right-3 flex gap-2">
                  <label
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 ${
                      thumbnailUploadingId ===
                      project.id
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    <Upload size={14} />

                    {thumbnailUploadingId ===
                    project.id
                      ? "Uploading..."
                      : project.thumbnail_url
                        ? "Change"
                        : "Upload"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={
                        thumbnailUploadingId ===
                        project.id
                      }
                      onChange={(
                        event,
                      ) => {
                        const file =
                          event.target
                            .files?.[0];

                        if (!file) {
                          return;
                        }

                        void handleThumbnailUpload(
                          project.id,
                          file,
                        );

                        /*
                         * Allow selecting the
                         * same file again.
                         */
                        event.target.value =
                          "";
                      }}
                    />
                  </label>

                  {project.thumbnail_url && (
                    <button
                      type="button"
                      disabled={
                        thumbnailDeletingId ===
                        project.id
                      }
                      onClick={() =>
                        void handleThumbnailDelete(
                          project.id,
                        )
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {thumbnailDeletingId ===
                      project.id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5">
                {/* Heading */}

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-slate-900">
                      {project.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      /{project.slug}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {project.featured && (
                      <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                        Featured
                      </span>
                    )}

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                      {project.status.replace(
                        "_",
                        " ",
                      )}
                    </span>
                  </div>
                </div>

                {/* Description */}

                <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                  {
                    project.short_description
                  }
                </p>

                {/* Technologies */}

                {project.technologies?.length >
                  0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map(
                      (technology) => (
                        <span
                          key={
                            technology.id
                          }
                          className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                        >
                          {
                            technology.name
                          }
                        </span>
                      ),
                    )}
                  </div>
                )}

                {/* Links */}

                <div className="mt-5 flex flex-wrap gap-3 text-xs">
                  {project.github_url && (
                    <a
                      href={
                        project.github_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-slate-600 hover:text-slate-900"
                    >
                      GitHub
                    </a>
                  )}

                  {project.live_url && (
                    <a
                      href={
                        project.live_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-slate-600 hover:text-slate-900"
                    >
                      Live Demo
                    </a>
                  )}
                </div>

                {/* Project actions */}

                <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(
                        project,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={
                      deletingId ===
                      project.id
                    }
                    onClick={() =>
                      void handleDelete(
                        project.id,
                        project.title,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />

                    {deletingId ===
                    project.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}