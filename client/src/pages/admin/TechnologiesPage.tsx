import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Code2,
  Edit,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  useCreateTechnology,
  useDeleteTechnology,
  useTechnologies,
  useUpdateTechnology,
} from "../../hooks/useTechnologies";

import type {
  CreateTechnologyPayload,
  Technology,
} from "../../types/technology";

interface TechnologyFormData {
  name: string;
  slug: string;
}

const initialFormData: TechnologyFormData = {
  name: "",
  slug: "",
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | {
          message?: string;
          errors?: Record<string, string>;
        }
      | undefined;

    if (data?.errors) {
      return Object.values(data.errors)[0];
    }

    if (data?.message) {
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
};

const generateSlug = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const TechnologiesPage = () => {
  const {
    data: technologies = [],
    isLoading,
    isError,
    error,
  } = useTechnologies();

  const createTechnology = useCreateTechnology();
  const updateTechnology = useUpdateTechnology();
  const deleteTechnology = useDeleteTechnology();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingTechnology, setEditingTechnology] =
    useState<Technology | null>(null);

  const [technologyToDelete, setTechnologyToDelete] =
    useState<Technology | null>(null);

  const [formData, setFormData] =
    useState<TechnologyFormData>(initialFormData);

  const [formError, setFormError] = useState("");

  const isSubmitting =
    createTechnology.isPending ||
    updateTechnology.isPending;

  useEffect(() => {
    if (!editingTechnology) {
      setFormData(initialFormData);
      return;
    }

    setFormData({
      name: editingTechnology.name,
      slug: editingTechnology.slug,
    });
  }, [editingTechnology]);

  const openCreateModal = () => {
    setEditingTechnology(null);
    setFormData(initialFormData);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (
    technology: Technology
  ) => {
    setEditingTechnology(technology);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setEditingTechnology(null);
    setFormData(initialFormData);
    setFormError("");
  };

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.value;

    setFormData((previous) => ({
      ...previous,
      name,
      slug: editingTechnology
        ? previous.slug
        : generateSlug(name),
    }));
  };

  const handleSlugChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const slug = event.target.value;

    setFormData((previous) => ({
      ...previous,
      slug,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError("");

    const name = formData.name.trim();
    const slug = generateSlug(formData.slug);

    if (!name) {
      setFormError("Technology name is required.");
      return;
    }

    if (!slug) {
      setFormError("Technology slug is required.");
      return;
    }

    const payload: CreateTechnologyPayload = {
      name,
      slug,
    };

    try {
      if (editingTechnology) {
        await updateTechnology.mutateAsync({
          id: editingTechnology.id,
          payload,
        });
      } else {
        await createTechnology.mutateAsync(payload);
      }

      closeModal();
    } catch (mutationError) {
      setFormError(
        getErrorMessage(mutationError)
      );
    }
  };

  const handleDelete = async () => {
    if (!technologyToDelete) {
      return;
    }

    try {
      await deleteTechnology.mutateAsync(
        technologyToDelete.id
      );

      setTechnologyToDelete(null);
    } catch {
      // Error is displayed in the dialog.
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading technologies...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {getErrorMessage(error)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Technologies
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage technologies used across projects and experience.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Technology
        </button>
      </div>

      {technologies.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <Code2
            size={42}
            className="text-gray-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No technologies added
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add technologies that you use in your projects and experience.
          </p>

          <button
            type="button"
            onClick={openCreateModal}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Technology
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="divide-y divide-gray-200">
            {technologies.map((technology) => (
              <div
                key={technology.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Code2
                      size={20}
                      className="text-gray-600"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {technology.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {technology.slug}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(technology)
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                    aria-label={`Edit ${technology.name}`}
                  >
                    <Edit size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTechnologyToDelete(technology)
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                    aria-label={`Delete ${technology.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal"
            onClick={closeModal}
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingTechnology
                    ? "Edit Technology"
                    : "Add Technology"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a reusable technology for projects and experience.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Technology Name
                </label>

                <input
                  id="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  placeholder="React"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Slug
                </label>

                <input
                  id="slug"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  required
                  placeholder="react"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Automatically generated from the technology name. You can edit it if needed.
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? editingTechnology
                      ? "Updating..."
                      : "Creating..."
                    : editingTechnology
                      ? "Update Technology"
                      : "Create Technology"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {technologyToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={() =>
              !deleteTechnology.isPending &&
              setTechnologyToDelete(null)
            }
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Technology
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {technologyToDelete.name}
              </span>
              ?
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              If this technology is currently being used by a project or experience, deletion may be blocked.
            </p>

            {deleteTechnology.isError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {getErrorMessage(deleteTechnology.error)}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setTechnologyToDelete(null)
                }
                disabled={deleteTechnology.isPending}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteTechnology.isPending}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteTechnology.isPending
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologiesPage;