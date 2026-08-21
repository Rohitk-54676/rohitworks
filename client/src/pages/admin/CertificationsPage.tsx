import {
  useEffect,
  useState,
} from "react";

import { AxiosError } from "axios";

import {
  Award,
  Calendar,
  Edit,
  ExternalLink,
  ImagePlus,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  useCertifications,
  useCreateCertification,
  useDeleteCertification,
  useDeleteCertificationMedia,
  useUpdateCertification,
  useUploadCertificationMedia,
} from "../../hooks/useCertifications";

import type {
  Certification,
  CreateCertificationPayload,
} from "../../types/certification";

interface CertificationFormData {
  title: string;
  issuing_organization: string;
  issue_date: string;
  credential_id: string;
  credential_url: string;
  display_order: string;
}

const initialFormData: CertificationFormData = {
  title: "",
  issuing_organization: "",
  issue_date: "",
  credential_id: "",
  credential_url: "",
  display_order: "0",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const getErrorMessage = (
  error: unknown
) => {
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

const formatDate = (
  date: string | null
) => {
  if (!date) {
    return "—";
  }

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    "en-IN",
    {
      month: "short",
      year: "numeric",
    }
  );
};

const CertificationsPage = () => {
  const {
    data: certifications = [],
    isLoading,
    isError,
    error,
  } = useCertifications();

  const createCertification =
    useCreateCertification();

  const updateCertification =
    useUpdateCertification();

  const deleteCertification =
    useDeleteCertification();

  const uploadCertificationMedia =
    useUploadCertificationMedia();

  const deleteCertificationMedia =
    useDeleteCertificationMedia();

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    editingCertification,
    setEditingCertification,
  ] = useState<Certification | null>(
    null
  );

  const [
    certificationToDelete,
    setCertificationToDelete,
  ] = useState<Certification | null>(
    null
  );

  const [
    formData,
    setFormData,
  ] = useState<CertificationFormData>(
    initialFormData
  );

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(null);

  const [
    imagePreview,
    setImagePreview,
  ] = useState<string | null>(null);

  const [
    formError,
    setFormError,
  ] = useState("");

  const isSubmitting =
    createCertification.isPending ||
    updateCertification.isPending;

  const isMediaUploading =
    uploadCertificationMedia.isPending;

  const isMediaDeleting =
    deleteCertificationMedia.isPending;

  useEffect(() => {
    if (!editingCertification) {
      setFormData(initialFormData);
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }

    setFormData({
      title: editingCertification.title,
      issuing_organization:
        editingCertification.issuing_organization,
      issue_date:
        editingCertification.issue_date ?? "",
      credential_id:
        editingCertification.credential_id ?? "",
      credential_url:
        editingCertification.credential_url ?? "",
      display_order: String(
        editingCertification.display_order
      ),
    });

    setSelectedFile(null);

    setImagePreview(
      editingCertification.certificate_image_url
    );
  }, [editingCertification]);

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const openCreateModal = () => {
    setEditingCertification(null);
    setFormData(initialFormData);
    setSelectedFile(null);
    setImagePreview(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (
    certification: Certification
  ) => {
    setEditingCertification(certification);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (
      isSubmitting ||
      isMediaUploading ||
      isMediaDeleting
    ) {
      return;
    }

    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setIsModalOpen(false);
    setEditingCertification(null);
    setFormData(initialFormData);
    setSelectedFile(null);
    setImagePreview(null);
    setFormError("");
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      setFormError(
        "Only JPEG, PNG, and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size > MAX_IMAGE_SIZE
    ) {
      setFormError(
        "Image size must not exceed 5 MB."
      );

      event.target.value = "";
      return;
    }

    setFormError("");

    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setImagePreview(previewUrl);
  };

  const removeSelectedFile = () => {
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setSelectedFile(null);

    setImagePreview(
      editingCertification?.certificate_image_url ??
        null
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError("");

    const title =
      formData.title.trim();

    const organization =
      formData.issuing_organization.trim();

    if (!title) {
      setFormError(
        "Title is required."
      );
      return;
    }

    if (
      title.length > 200
    ) {
      setFormError(
        "Title must not exceed 200 characters."
      );
      return;
    }

    if (!organization) {
      setFormError(
        "Issuing organization is required."
      );
      return;
    }

    if (
      organization.length > 200
    ) {
      setFormError(
        "Issuing organization must not exceed 200 characters."
      );
      return;
    }

    const credentialId =
      formData.credential_id.trim();

    if (
      credentialId.length > 200
    ) {
      setFormError(
        "Credential ID must not exceed 200 characters."
      );
      return;
    }

    const credentialUrl =
      formData.credential_url.trim();

    if (credentialUrl) {
      try {
        new URL(credentialUrl);
      } catch {
        setFormError(
          "Credential URL must be a valid URL."
        );
        return;
      }
    }

    const displayOrder = Number(
      formData.display_order
    );

    if (
      !Number.isInteger(
        displayOrder
      )
    ) {
      setFormError(
        "Display order must be an integer."
      );
      return;
    }

    const payload: CreateCertificationPayload = {
      title,
      issuing_organization:
        organization,
      issue_date:
        formData.issue_date || null,
      credential_id:
        credentialId || null,
      credential_url:
        credentialUrl || null,
      display_order:
        displayOrder,
    };

    try {
      let certificationId =
        editingCertification?.id;

      if (editingCertification) {
        await updateCertification.mutateAsync({
          id: editingCertification.id,
          payload,
        });
      } else {
        const created =
          await createCertification.mutateAsync(
            payload
          );

        certificationId =
          created.id;
      }

      if (
        selectedFile &&
        certificationId
      ) {
        await uploadCertificationMedia.mutateAsync(
          {
            id: certificationId,
            file: selectedFile,
          }
        );
      }

      closeModal();
    } catch (mutationError) {
      setFormError(
        getErrorMessage(
          mutationError
        )
      );
    }
  };

  const handleDelete = async () => {
    if (!certificationToDelete) {
      return;
    }

    try {
      await deleteCertification.mutateAsync(
        certificationToDelete.id
      );

      setCertificationToDelete(null);
    } catch {
      // Error displayed in modal.
    }
  };

  const handleDeleteMedia = async () => {
    if (!editingCertification) {
      return;
    }

    try {
      await deleteCertificationMedia.mutateAsync(
        editingCertification.id
      );

      setEditingCertification({
        ...editingCertification,
        certificate_image_url: null,
        certificate_image_public_id: null,
      });

      setImagePreview(null);
      setSelectedFile(null);
    } catch (mediaError) {
      setFormError(
        getErrorMessage(mediaError)
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading certifications...
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
            Certifications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your professional certifications
            and credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <Award
            size={42}
            className="text-gray-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No certifications yet
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add your professional certificates
            and credentials.
          </p>

          <button
            type="button"
            onClick={openCreateModal}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Certification
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {certifications.map(
            (certification) => (
              <div
                key={certification.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                {certification.certificate_image_url ? (
                  <img
                    src={
                      certification.certificate_image_url
                    }
                    alt={
                      certification.title
                    }
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gray-100">
                    <Award
                      size={42}
                      className="text-gray-400"
                    />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">
                        {certification.title}
                      </h2>

                      <p className="mt-1 text-sm font-medium text-gray-600">
                        {
                          certification.issuing_organization
                        }
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            certification
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                        aria-label="Edit certification"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setCertificationToDelete(
                            certification
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        aria-label="Delete certification"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    {certification.issue_date && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={14} />

                        {formatDate(
                          certification.issue_date
                        )}
                      </span>
                    )}

                    {certification.credential_id && (
                      <span>
                        ID:{" "}
                        {
                          certification.credential_id
                        }
                      </span>
                    )}

                    <span>
                      Order:{" "}
                      {
                        certification.display_order
                      }
                    </span>
                  </div>

                  {certification.credential_url && (
                    <a
                      href={
                        certification.credential_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline"
                    >
                      View Credential

                      <ExternalLink size={15} />
                    </a>
                  )}
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

          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingCertification
                    ? "Edit Certification"
                    : "Add Certification"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add certification details and
                  an optional certificate image.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={
                  isSubmitting ||
                  isMediaUploading ||
                  isMediaDeleting
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
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
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Title
                </label>

                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={200}
                  required
                  placeholder="Full Stack Web Development"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="issuing_organization"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Issuing Organization
                </label>

                <input
                  id="issuing_organization"
                  name="issuing_organization"
                  value={
                    formData.issuing_organization
                  }
                  onChange={handleChange}
                  maxLength={200}
                  required
                  placeholder="Coursera"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="issue_date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Issue Date
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="issue_date"
                  name="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="credential_id"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Credential ID
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="credential_id"
                  name="credential_id"
                  value={formData.credential_id}
                  onChange={handleChange}
                  maxLength={200}
                  placeholder="ABC123XYZ"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="credential_url"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Credential URL
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="credential_url"
                  name="credential_url"
                  type="url"
                  value={formData.credential_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="border-t border-gray-200 pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Certificate Image
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      JPEG, PNG, or WebP. Maximum 5 MB.
                    </p>
                  </div>

                  {editingCertification?.certificate_image_url &&
                    !selectedFile && (
                      <button
                        type="button"
                        onClick={handleDeleteMedia}
                        disabled={isMediaDeleting}
                        className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                      >
                        {isMediaDeleting
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    )}
                </div>

                {imagePreview ? (
                  <div className="relative overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Certificate preview"
                      className="h-52 w-full object-cover"
                    />

                    {selectedFile && (
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                        aria-label="Remove selected image"
                      >
                        <X size={17} />
                      </button>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="certificate-media"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center transition hover:border-gray-500 hover:bg-gray-50"
                  >
                    <ImagePlus
                      size={30}
                      className="text-gray-400"
                    />

                    <span className="mt-3 text-sm font-medium text-gray-700">
                      Select certificate image
                    </span>

                    <span className="mt-1 text-xs text-gray-500">
                      JPEG, PNG, WebP up to 5 MB
                    </span>
                  </label>
                )}

                <input
                  id="certificate-media"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imagePreview && (
                  <label
                    htmlFor="certificate-media"
                    className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <Upload size={16} />

                    {selectedFile
                      ? "Choose another image"
                      : "Replace image"}
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={
                    isSubmitting ||
                    isMediaUploading ||
                    isMediaDeleting
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isMediaUploading ||
                    isMediaDeleting
                  }
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSubmitting ||
                  isMediaUploading
                    ? editingCertification
                      ? "Updating..."
                      : "Creating..."
                    : editingCertification
                      ? "Update Certification"
                      : "Create Certification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {certificationToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() =>
              !deleteCertification.isPending &&
              setCertificationToDelete(null)
            }
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
          />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Certification
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {certificationToDelete.title}
              </span>
              ? Its certificate image will also be
              removed.
            </p>

            {deleteCertification.isError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {getErrorMessage(
                  deleteCertification.error
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setCertificationToDelete(null)
                }
                disabled={
                  deleteCertification.isPending
                }
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleteCertification.isPending
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteCertification.isPending
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

export default CertificationsPage;