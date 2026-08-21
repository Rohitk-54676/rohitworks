import { useEffect, useState } from "react";

import { AxiosError } from "axios";

import {
  Edit,
  ExternalLink,
  Link,
  Plus,
  Power,
  Trash2,
  X,
} from "lucide-react";

import {
  useCreateSocialLink,
  useDeleteSocialLink,
  useSocialLinks,
  useUpdateSocialLink,
} from "../../hooks/useSocialLinks";

import type {
  CreateSocialLinkPayload,
  SocialLink,
} from "../../types/social-link";

interface SocialLinkFormData {
  platform: string;
  url: string;
  display_order: string;
  is_active: boolean;
}

const initialFormData: SocialLinkFormData = {
  platform: "",
  url: "",
  display_order: "0",
  is_active: true,
};

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

const SocialLinksPage = () => {
  const {
    data: socialLinks = [],
    isLoading,
    isError,
    error,
  } = useSocialLinks();

  const createSocialLink =
    useCreateSocialLink();

  const updateSocialLink =
    useUpdateSocialLink();

  const deleteSocialLink =
    useDeleteSocialLink();

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    editingSocialLink,
    setEditingSocialLink,
  ] = useState<SocialLink | null>(
    null
  );

  const [
    socialLinkToDelete,
    setSocialLinkToDelete,
  ] = useState<SocialLink | null>(
    null
  );

  const [
    formData,
    setFormData,
  ] = useState<SocialLinkFormData>(
    initialFormData
  );

  const [
    formError,
    setFormError,
  ] = useState("");

  const isSubmitting =
    createSocialLink.isPending ||
    updateSocialLink.isPending;

  useEffect(() => {
    if (!editingSocialLink) {
      setFormData(initialFormData);
      return;
    }

    setFormData({
      platform: editingSocialLink.platform,
      url: editingSocialLink.url,
      display_order: String(
        editingSocialLink.display_order
      ),
      is_active:
        editingSocialLink.is_active,
    });
  }, [editingSocialLink]);

  const openCreateModal = () => {
    setEditingSocialLink(null);
    setFormData(initialFormData);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (
    socialLink: SocialLink
  ) => {
    setEditingSocialLink(socialLink);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setEditingSocialLink(null);
    setFormData(initialFormData);
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
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError("");

    const platform =
      formData.platform.trim();

    const url =
      formData.url.trim();

    if (!platform) {
      setFormError(
        "Platform is required."
      );
      return;
    }

    if (
      platform.length > 100
    ) {
      setFormError(
        "Platform must not exceed 100 characters."
      );
      return;
    }

    if (!url) {
      setFormError(
        "URL is required."
      );
      return;
    }

    try {
      new URL(url);
    } catch {
      setFormError(
        "URL must be a valid URL."
      );
      return;
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

    const payload: CreateSocialLinkPayload = {
      platform,
      url,
      display_order: displayOrder,
      is_active: formData.is_active,
    };

    try {
      if (editingSocialLink) {
        await updateSocialLink.mutateAsync({
          id: editingSocialLink.id,
          payload,
        });
      } else {
        await createSocialLink.mutateAsync(
          payload
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
    if (!socialLinkToDelete) {
      return;
    }

    try {
      await deleteSocialLink.mutateAsync(
        socialLinkToDelete.id
      );

      setSocialLinkToDelete(null);
    } catch {
      // Error is displayed inside the confirmation modal.
    }
  };

  const handleToggleActive = async (
    socialLink: SocialLink
  ) => {
    try {
      await updateSocialLink.mutateAsync({
        id: socialLink.id,
        payload: {
          is_active:
            !socialLink.is_active,
        },
      });
    } catch {
      // React Query keeps the existing data.
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading social links...
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
            Social Links
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the social and professional
            links displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Social Link
        </button>
      </div>

      {socialLinks.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <Link
            size={42}
            className="text-gray-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No social links yet
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add links to your professional and
            social profiles.
          </p>

          <button
            type="button"
            onClick={openCreateModal}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Social Link
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Platform
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    URL
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {socialLinks.map(
                  (socialLink) => (
                    <tr
                      key={socialLink.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">
                          {
                            socialLink.platform
                          }
                        </div>
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <a
                          href={socialLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 truncate text-sm text-gray-600 hover:text-gray-900 hover:underline"
                        >
                          <span className="truncate">
                            {
                              socialLink.url
                            }
                          </span>

                          <ExternalLink
                            size={14}
                            className="shrink-0"
                          />
                        </a>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {
                          socialLink.display_order
                        }
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            socialLink.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {socialLink.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleActive(
                                socialLink
                              )
                            }
                            disabled={
                              updateSocialLink.isPending
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            aria-label={
                              socialLink.is_active
                                ? "Deactivate social link"
                                : "Activate social link"
                            }
                          >
                            <Power
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                socialLink
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                            aria-label="Edit social link"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setSocialLinkToDelete(
                                socialLink
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            aria-label="Delete social link"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
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
                  {editingSocialLink
                    ? "Edit Social Link"
                    : "Add Social Link"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a platform and its public
                  profile URL.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
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
                  htmlFor="platform"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Platform
                </label>

                <input
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  placeholder="LinkedIn"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="url"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  URL
                </label>

                <input
                  id="url"
                  name="url"
                  type="url"
                  value={formData.url}
                  onChange={handleChange}
                  required
                  placeholder="https://linkedin.com/in/..."
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
                  value={
                    formData.display_order
                  }
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Active
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Inactive links will not appear
                    on the public portfolio.
                  </p>
                </div>

                <input
                  name="is_active"
                  type="checkbox"
                  checked={
                    formData.is_active
                  }
                  onChange={handleChange}
                  className="h-4 w-4"
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSubmitting
                    ? editingSocialLink
                      ? "Updating..."
                      : "Creating..."
                    : editingSocialLink
                      ? "Update Social Link"
                      : "Create Social Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {socialLinkToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() =>
              !deleteSocialLink.isPending &&
              setSocialLinkToDelete(null)
            }
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
          />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Social Link
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to delete the{" "}
              <span className="font-medium text-gray-900">
                {
                  socialLinkToDelete.platform
                }
              </span>{" "}
              link?
            </p>

            {deleteSocialLink.isError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {getErrorMessage(
                  deleteSocialLink.error
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setSocialLinkToDelete(null)
                }
                disabled={
                  deleteSocialLink.isPending
                }
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleteSocialLink.isPending
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteSocialLink.isPending
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

export default SocialLinksPage;