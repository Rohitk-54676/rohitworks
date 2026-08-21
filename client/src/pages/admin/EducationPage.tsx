import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Edit,
  GraduationCap,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  useCreateEducation,
  useDeleteEducation,
  useEducation,
  useUpdateEducation,
} from "../../hooks/useEducation";

import type {
  CreateEducationPayload,
  Education,
} from "../../types/education";

interface EducationFormData {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  description: string;
  display_order: string;
}

const initialFormData: EducationFormData = {
  institution: "",
  degree: "",
  field: "",
  start_date: "",
  end_date: "",
  description: "",
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

const formatDate = (date: string | null) => {
  if (!date) {
    return "—";
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      month: "short",
      year: "numeric",
    }
  );
};

const EducationPage = () => {
  const {
    data: education = [],
    isLoading,
    isError,
    error,
  } = useEducation();

  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] =
    useState<Education | null>(null);

  const [educationToDelete, setEducationToDelete] =
    useState<Education | null>(null);

  const [formData, setFormData] =
    useState<EducationFormData>(initialFormData);

  const [formError, setFormError] = useState("");

  const isSubmitting =
    createEducation.isPending || updateEducation.isPending;

  useEffect(() => {
    if (!editingEducation) {
      setFormData(initialFormData);
      return;
    }

    setFormData({
      institution: editingEducation.institution,
      degree: editingEducation.degree,
      field: editingEducation.field ?? "",
      start_date: editingEducation.start_date ?? "",
      end_date: editingEducation.end_date ?? "",
      description: editingEducation.description ?? "",
      display_order: String(
        editingEducation.display_order
      ),
    });
  }, [editingEducation]);

  const openCreateModal = () => {
    setEditingEducation(null);
    setFormError("");
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Education) => {
    setEditingEducation(item);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setEditingEducation(null);
    setFormData(initialFormData);
    setFormError("");
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
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

    const institution = formData.institution.trim();
    const degree = formData.degree.trim();

    if (!institution) {
      setFormError("Institution is required.");
      return;
    }

    if (institution.length > 200) {
      setFormError(
        "Institution must not exceed 200 characters."
      );
      return;
    }

    if (!degree) {
      setFormError("Degree is required.");
      return;
    }

    if (degree.length > 200) {
      setFormError(
        "Degree must not exceed 200 characters."
      );
      return;
    }

    if (
      formData.field.trim().length > 200
    ) {
      setFormError(
        "Field must not exceed 200 characters."
      );
      return;
    }

    if (
      formData.start_date &&
      formData.end_date &&
      formData.end_date < formData.start_date
    ) {
      setFormError(
        "End date cannot be before start date."
      );
      return;
    }

    const displayOrder = Number(
      formData.display_order
    );

    if (
      !Number.isInteger(displayOrder)
    ) {
      setFormError(
        "Display order must be an integer."
      );
      return;
    }

    const payload: CreateEducationPayload = {
      institution,
      degree,
      field: formData.field.trim() || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      description:
        formData.description.trim() || null,
      display_order: displayOrder,
    };

    try {
      if (editingEducation) {
        await updateEducation.mutateAsync({
          id: editingEducation.id,
          payload,
        });
      } else {
        await createEducation.mutateAsync(
          payload
        );
      }

      closeModal();
    } catch (mutationError) {
      setFormError(
        getErrorMessage(mutationError)
      );
    }
  };

  const handleDelete = async () => {
    if (!educationToDelete) {
      return;
    }

    try {
      await deleteEducation.mutateAsync(
        educationToDelete.id
      );

      setEducationToDelete(null);
    } catch {
      // Error is shown below in the confirmation dialog.
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-gray-500">
          Loading education...
        </div>
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
            Education
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your educational background.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <GraduationCap
            size={42}
            className="text-gray-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No education entries
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add your educational background to
            display it on your portfolio.
          </p>

          <button
            type="button"
            onClick={openCreateModal}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Education
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="divide-y divide-gray-200">
            {education.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <GraduationCap
                      size={21}
                      className="text-gray-600"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-900">
                      {item.degree}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {item.institution}
                    </p>

                    {item.field && (
                      <p className="mt-1 text-sm text-gray-500">
                        {item.field}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-gray-500">
                      {formatDate(item.start_date)}
                      {" — "}
                      {formatDate(item.end_date)}
                    </p>

                    {item.description && (
                      <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-3">
                      <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        Order: {item.display_order}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(item)
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                    aria-label="Edit education"
                  >
                    <Edit size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEducationToDelete(item)
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                    aria-label="Delete education"
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

          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingEducation
                    ? "Edit Education"
                    : "Add Education"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Fill in the education details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
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

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="institution"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Institution
                  </label>

                  <input
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    maxLength={200}
                    required
                    placeholder="Lovely Professional University"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="degree"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Degree
                  </label>

                  <input
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    maxLength={200}
                    required
                    placeholder="Bachelor of Technology"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="field"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Field
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="field"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  maxLength={200}
                  placeholder="Computer Science and Engineering"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="start_date"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Start Date
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end_date"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    End Date
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={
                      formData.start_date ||
                      undefined
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Add relevant details about your education..."
                  className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
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

              <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? editingEducation
                      ? "Updating..."
                      : "Creating..."
                    : editingEducation
                      ? "Update Education"
                      : "Create Education"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {educationToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={() =>
              !deleteEducation.isPending &&
              setEducationToDelete(null)
            }
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Education
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {educationToDelete.degree}
              </span>
              ? This action cannot be undone.
            </p>

            {deleteEducation.isError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {getErrorMessage(
                  deleteEducation.error
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setEducationToDelete(null)
                }
                disabled={deleteEducation.isPending}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteEducation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteEducation.isPending
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

export default EducationPage;