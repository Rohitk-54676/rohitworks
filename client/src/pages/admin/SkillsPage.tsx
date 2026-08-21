import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import {
  Code2,
  Edit,
  FolderOpen,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import {
  useCreateSkill,
  useDeleteSkill,
  useSkills,
  useUpdateSkill,
} from "../../hooks/useSkills";

import type {
  CreateSkillPayload,
  Skill,
} from "../../types/skill";

interface SkillFormData {
  name: string;
  category: string;
  icon_reference: string;
  display_order: string;
}

const initialFormData: SkillFormData = {
  name: "",
  category: "",
  icon_reference: "",
  display_order: "0",
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

const SkillsPage = () => {
  const {
    data: skills = [],
    isLoading,
    isError,
    error,
  } = useSkills();

  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingSkill, setEditingSkill] =
    useState<Skill | null>(null);

  const [skillToDelete, setSkillToDelete] =
    useState<Skill | null>(null);

  const [formData, setFormData] =
    useState<SkillFormData>(initialFormData);

  const [formError, setFormError] = useState("");

  const isSubmitting =
    createSkill.isPending || updateSkill.isPending;

  useEffect(() => {
    if (!editingSkill) {
      setFormData(initialFormData);
      return;
    }

    setFormData({
      name: editingSkill.name,
      category: editingSkill.category ?? "",
      icon_reference:
        editingSkill.icon_reference ?? "",
      display_order: String(
        editingSkill.display_order
      ),
    });
  }, [editingSkill]);

  const groupedSkills = useMemo(() => {
    return skills.reduce<
      Record<string, Skill[]>
    >((groups, skill) => {
      const category =
        skill.category?.trim() || "Uncategorized";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);

      return groups;
    }, {});
  }, [skills]);

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData(initialFormData);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData(initialFormData);
    setFormError("");
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError("");

    const name = formData.name.trim();
    const category = formData.category.trim();
    const iconReference =
      formData.icon_reference.trim();

    if (!name) {
      setFormError("Skill name is required.");
      return;
    }

    const displayOrder = Number(
      formData.display_order
    );

    if (!Number.isInteger(displayOrder)) {
      setFormError(
        "Display order must be an integer."
      );
      return;
    }

    const payload: CreateSkillPayload = {
      name,
      category: category || null,
      icon_reference: iconReference || null,
      display_order: displayOrder,
    };

    try {
      if (editingSkill) {
        await updateSkill.mutateAsync({
          id: editingSkill.id,
          payload,
        });
      } else {
        await createSkill.mutateAsync(payload);
      }

      closeModal();
    } catch (mutationError) {
      setFormError(
        getErrorMessage(mutationError)
      );
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) {
      return;
    }

    try {
      await deleteSkill.mutateAsync(
        skillToDelete.id
      );

      setSkillToDelete(null);
    } catch {
      // Error is displayed in the dialog.
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading skills...
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
            Skills
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your technical and professional
            skills.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <Code2
            size={42}
            className="text-gray-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No skills added
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add your skills and organize them into
            categories.
          </p>

          <button
            type="button"
            onClick={openCreateModal}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Skill
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(
            ([category, categorySkills]) => (
              <div
                key={category}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4">
                  <FolderOpen
                    size={18}
                    className="text-gray-500"
                  />

                  <h2 className="text-sm font-semibold text-gray-900">
                    {category}
                  </h2>

                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {categorySkills.length}
                  </span>
                </div>

                <div className="divide-y divide-gray-200">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
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
                            {skill.name}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {skill.icon_reference && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                <Tag size={12} />
                                {skill.icon_reference}
                              </span>
                            )}

                            <span className="text-xs text-gray-500">
                              Order:{" "}
                              {skill.display_order}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(skill)
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                          aria-label={`Edit ${skill.name}`}
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSkillToDelete(skill)
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                          aria-label={`Delete ${skill.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
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
                  {editingSkill
                    ? "Edit Skill"
                    : "Add Skill"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage a skill and its category.
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
                  Skill Name
                </label>

                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="React"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Frontend"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="icon_reference"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Icon Reference
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="icon_reference"
                  name="icon_reference"
                  value={formData.icon_reference}
                  onChange={handleChange}
                  placeholder="react, javascript, nodejs..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />

                <p className="mt-2 text-xs text-gray-500">
                  This is a text reference. It is not an
                  image upload.
                </p>
              </div>

              <div>
                <label
                  htmlFor="display_order"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Display Order
                </label>

                <input
                  id="display_order"
                  name="display_order"
                  type="number"
                  step="1"
                  value={formData.display_order}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
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
                    ? editingSkill
                      ? "Updating..."
                      : "Creating..."
                    : editingSkill
                      ? "Update Skill"
                      : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {skillToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={() =>
              !deleteSkill.isPending &&
              setSkillToDelete(null)
            }
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Skill
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {skillToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            {deleteSkill.isError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {getErrorMessage(deleteSkill.error)}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setSkillToDelete(null)
                }
                disabled={deleteSkill.isPending}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteSkill.isPending}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteSkill.isPending
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

export default SkillsPage;