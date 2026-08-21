import { useMemo, useState } from "react";

import {
  useCreateExperience,
  useDeleteExperience,
  useExperiences,
  useUpdateExperience,
} from "../../hooks/useExperience";

import type {
  CreateExperiencePayload,
  Experience,
  UpdateExperiencePayload,
} from "../../types/experience";

type FormState = {
  organization: string;
  role: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  achievements: string;
  display_order: string;
  technology_ids: string[];
};

const emptyForm: FormState = {
  organization: "",
  role: "",
  location: "",
  description: "",
  start_date: "",
  end_date: "",
  is_current: false,
  achievements: "",
  display_order: "0",
  technology_ids: [],
};

function formatDate(value: string | null) {
  if (!value) {
    return "Present";
  }

  return value.slice(0, 10);
}

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string>;
          };
        };
      }
    ).response;

    if (response?.data?.errors) {
      return Object.values(response.data.errors).join(", ");
    }

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export default function ExperiencePage() {
  const {
    data: experiences = [],
    isLoading,
    isError,
    error,
  } = useExperiences();

  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<Experience | null>(null);

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [selectedTechnologyIds, setSelectedTechnologyIds] =
    useState<string[]>([]);

  const isSubmitting =
    createExperience.isPending ||
    updateExperience.isPending;

  const sortedExperiences = useMemo(() => {
    return [...experiences].sort(
      (a, b) =>
        a.display_order - b.display_order,
    );
  }, [experiences]);

  /*
   * Collect technologies already returned by
   * experience API responses.
   *
   * This does not invent another technologies API.
   */
  const technologies = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        slug: string;
      }
    >();

    experiences.forEach((experience) => {
      experience.technologies?.forEach(
        (technology) => {
          map.set(technology.id, technology);
        },
      );
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [experiences]);

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedTechnologyIds([]);
    setEditingExperience(null);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    resetForm();
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (
    experience: Experience,
  ) => {
    setEditingExperience(experience);

    setForm({
      organization:
        experience.organization ?? "",

      role:
        experience.role ?? "",

      location:
        experience.location ?? "",

      description:
        experience.description ?? "",

      start_date:
        experience.start_date
          ? experience.start_date.slice(0, 10)
          : "",

      end_date:
        experience.end_date
          ? experience.end_date.slice(0, 10)
          : "",

      is_current:
        Boolean(experience.is_current),

      /*
       * IMPORTANT:
       * achievements is a STRING.
       */
      achievements:
        experience.achievements ?? "",

      display_order:
        String(experience.display_order ?? 0),

      technology_ids:
        experience.technologies?.map(
          (technology) => technology.id,
        ) ?? [],
    });

    setSelectedTechnologyIds(
      experience.technologies?.map(
        (technology) => technology.id,
      ) ?? [],
    );

    setIsModalOpen(true);
  };

  const updateField = <
    K extends keyof FormState
  >(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleTechnology = (
    technologyId: string,
  ) => {
    setSelectedTechnologyIds((current) => {
      if (current.includes(technologyId)) {
        return current.filter(
          (id) => id !== technologyId,
        );
      }

      return [...current, technologyId];
    });
  };

  const validateForm = () => {
    if (!form.organization.trim()) {
      alert("Organization is required");
      return false;
    }

    if (!form.role.trim()) {
      alert("Role is required");
      return false;
    }

    if (!form.start_date) {
      alert("Start date is required");
      return false;
    }

    if (
      !form.is_current &&
      form.end_date &&
      form.end_date < form.start_date
    ) {
      alert(
        "End date cannot be before start date",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * achievements MUST remain a string.
     *
     * Do NOT split it into an array.
     */
    const achievements =
      form.achievements.trim() || null;

    const technologyIds =
      Array.isArray(selectedTechnologyIds)
        ? selectedTechnologyIds
        : [];

    const displayOrder = Number(
      form.display_order || "0",
    );

    if (
      !Number.isInteger(displayOrder)
    ) {
      alert(
        "Display order must be a valid integer",
      );
      return;
    }

    const payload: CreateExperiencePayload = {
      organization:
        form.organization.trim(),

      role:
        form.role.trim(),

      location:
        form.location.trim() || null,

      description:
        form.description.trim() || null,

      start_date:
        form.start_date,

      end_date:
        form.is_current
          ? null
          : form.end_date || null,

      is_current:
        Boolean(form.is_current),

      achievements,

      display_order:
        displayOrder,

      technology_ids:
        technologyIds,
    };

    console.log(
      "Experience payload:",
      payload,
    );

    try {
      if (editingExperience) {
        const updatePayload: UpdateExperiencePayload =
          {
            organization:
              payload.organization,

            role:
              payload.role,

            location:
              payload.location,

            description:
              payload.description,

            start_date:
              payload.start_date,

            end_date:
              payload.end_date,

            is_current:
              payload.is_current,

            achievements:
              payload.achievements,

            display_order:
              payload.display_order,

            technology_ids:
              payload.technology_ids,
          };

        await updateExperience.mutateAsync({
          id: editingExperience.id,
          payload: updatePayload,
        });

        alert(
          "Experience updated successfully.",
        );
      } else {
        await createExperience.mutateAsync(
          payload,
        );

        alert(
          "Experience created successfully.",
        );
      }

      closeModal();
    } catch (error) {
      console.error(
        "Experience save failed:",
        error,
      );

      alert(
        `Experience ${
          editingExperience
            ? "update"
            : "creation"
        } failed: ${getErrorMessage(error)}`,
      );
    }
  };

  const handleDelete = async (
    experience: Experience,
  ) => {
    const confirmed = window.confirm(
      `Delete "${experience.role}" at "${experience.organization}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteExperience.mutateAsync(
        experience.id,
      );

      alert(
        "Experience deleted successfully.",
      );
    } catch (error) {
      console.error(
        "Experience delete failed:",
        error,
      );

      alert(
        `Failed to delete experience: ${getErrorMessage(
          error,
        )}`,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            Loading experiences...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-sm font-semibold text-red-700">
            Failed to load experiences
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {getErrorMessage(error)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Experience
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your professional experience.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Add Experience
        </button>
      </div>

      {/* Experience list */}

      {sortedExperiences.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="text-base font-semibold text-slate-900">
            No experience yet
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add your first experience entry.
          </p>

          <button
            type="button"
            onClick={openCreateModal}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Add Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedExperiences.map(
            (experience) => (
              <div
                key={experience.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {experience.role}
                      </h2>

                      {experience.is_current && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Current
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {experience.organization}
                    </p>

                    {experience.location && (
                      <p className="mt-1 text-sm text-slate-500">
                        {experience.location}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-slate-500">
                      {formatDate(
                        experience.start_date,
                      )}{" "}
                      —{" "}
                      {experience.is_current
                        ? "Present"
                        : formatDate(
                            experience.end_date,
                          )}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(
                          experience,
                        )
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={
                        deleteExperience.isPending
                      }
                      onClick={() =>
                        handleDelete(
                          experience,
                        )
                      }
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {experience.description && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {experience.description}
                  </p>
                )}

                {experience.achievements && (
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Achievement
                    </h3>

                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                      {experience.achievements}
                    </p>
                  </div>
                )}

                {experience.technologies?.length >
                  0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {experience.technologies.map(
                      (technology) => (
                        <span
                          key={technology.id}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {technology.name}
                        </span>
                      ),
                    )}
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      )}

      {/* Modal */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingExperience
                    ? "Edit Experience"
                    : "Add Experience"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Keep the information accurate and concise.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              {/* Organization */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Organization
                </label>

                <input
                  type="text"
                  value={form.organization}
                  onChange={(event) =>
                    updateField(
                      "organization",
                      event.target.value,
                    )
                  }
                  placeholder="Company or organization"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              {/* Role */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>

                <input
                  type="text"
                  value={form.role}
                  onChange={(event) =>
                    updateField(
                      "role",
                      event.target.value,
                    )
                  }
                  placeholder="Software Developer"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              {/* Location */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Location
                </label>

                <input
                  type="text"
                  value={form.location}
                  onChange={(event) =>
                    updateField(
                      "location",
                      event.target.value,
                    )
                  }
                  placeholder="Remote / Punjab, India"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              {/* Description */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                  rows={5}
                  placeholder="Describe your responsibilities and work."
                  className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              {/* Dates */}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(event) =>
                      updateField(
                        "start_date",
                        event.target.value,
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
                    value={form.end_date}
                    disabled={form.is_current}
                    onChange={(event) =>
                      updateField(
                        "end_date",
                        event.target.value,
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Current */}

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_current}
                  onChange={(event) => {
                    const checked =
                      event.target.checked;

                    updateField(
                      "is_current",
                      checked,
                    );

                    if (checked) {
                      updateField(
                        "end_date",
                        "",
                      );
                    }
                  }}
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span className="text-sm font-medium text-slate-700">
                  This is my current position
                </span>
              </label>

              {/* Achievement */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Achievement
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  Describe your key achievement or contribution.
                </p>

                <textarea
                  value={form.achievements}
                  onChange={(event) =>
                    updateField(
                      "achievements",
                      event.target.value,
                    )
                  }
                  rows={5}
                  placeholder="Built and maintained..."
                  className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              {/* Technologies */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Technologies
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  Select technologies associated with this experience.
                </p>

                {technologies.length === 0 ? (
                  <div className="mt-2 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    No technologies are currently available from the Experience API.
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {technologies.map(
                      (technology) => {
                        const selected =
                          selectedTechnologyIds.includes(
                            technology.id,
                          );

                        return (
                          <button
                            key={technology.id}
                            type="button"
                            onClick={() =>
                              toggleTechnology(
                                technology.id,
                              )
                            }
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                              selected
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {technology.name}
                          </button>
                        );
                      },
                    )}
                  </div>
                )}
              </div>

              {/* Display order */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Display Order
                </label>

                <input
                  type="number"
                  step="1"
                  value={form.display_order}
                  onChange={(event) =>
                    updateField(
                      "display_order",
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              {/* Actions */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingExperience
                      ? "Update Experience"
                      : "Create Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}