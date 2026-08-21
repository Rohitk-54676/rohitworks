import {
  useEffect,
  useRef,
  useState,
} from "react";

import { AxiosError } from "axios";

import {
  Download,
  FileText,
  Image,
  Save,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";

import {
  useDeleteProfileImage,
  useDeleteResume,
  useSiteSettings,
  useUpdateSiteSettings,
  useUploadProfileImage,
  useUploadResume,
} from "../../hooks/useSiteSettings";

import type {
  UpdateSiteSettingsPayload,
} from "../../types/site-settings";

interface SettingsFormData {
  name: string;
  headline: string;
  bio: string;
  email: string;
  location: string;
  availability_status: string;
  current_focus: string;
}

const initialFormData: SettingsFormData = {
  name: "",
  headline: "",
  bio: "",
  email: "",
  location: "",
  availability_status: "",
  current_focus: "",
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
      return Object.values(
        data.errors
      )[0];
    }

    if (data?.message) {
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
};

const SiteSettingsPage = () => {
  const {
    data: settings,
    isLoading,
    isError,
    error,
  } = useSiteSettings();

  const updateSettings =
    useUpdateSiteSettings();

  const uploadProfileImage =
    useUploadProfileImage();

  const deleteProfileImage =
    useDeleteProfileImage();

  const uploadResume =
    useUploadResume();

  const deleteResume =
    useDeleteResume();

  const [
    formData,
    setFormData,
  ] = useState<SettingsFormData>(
    initialFormData
  );

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    isDownloadingResume,
    setIsDownloadingResume,
  ] = useState(false);

  const profileImageInputRef =
    useRef<HTMLInputElement>(null);

  const resumeInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!settings) {
      return;
    }

    setFormData({
      name:
        settings.name ?? "",

      headline:
        settings.headline ?? "",

      bio:
        settings.bio ?? "",

      email:
        settings.email ?? "",

      location:
        settings.location ?? "",

      availability_status:
        settings.availability_status ??
        "",

      current_focus:
        settings.current_focus ??
        "",
    });
  }, [settings]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
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

  const handleSave = async (
    event: React.FormEvent<
      HTMLFormElement
    >
  ) => {
    event.preventDefault();

    setFormError("");

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      setFormError(
        "Please enter a valid email address."
      );

      return;
    }

    try {
      const payload: UpdateSiteSettingsPayload = {
        name: formData.name.trim(),
        headline: formData.headline.trim(),
        bio: formData.bio.trim(),
        email: formData.email.trim(),
        location: formData.location.trim(),
        availability_status:
            formData.availability_status.trim(),
        current_focus:
            formData.current_focus.trim(),
        };

      await updateSettings.mutateAsync(
        payload
      );
    } catch (mutationError) {
      setFormError(
        getErrorMessage(
          mutationError
        )
      );
    }
  };

  const handleProfileImageChange = async (
    event: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setFormError(
        "Please select a valid image file."
      );

      return;
    }

    try {
      setFormError("");

      await uploadProfileImage.mutateAsync(
        file
      );
    } catch (mutationError) {
      setFormError(
        getErrorMessage(
          mutationError
        )
      );
    } finally {
      if (
        profileImageInputRef.current
      ) {
        profileImageInputRef.current.value =
          "";
      }
    }
  };

  const handleDeleteProfileImage =
    async () => {
      try {
        setFormError("");

        await deleteProfileImage.mutateAsync();
      } catch (mutationError) {
        setFormError(
          getErrorMessage(
            mutationError
          )
        );
      }
    };

  const handleResumeChange = async (
    event: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const isPdf =
      file.type ===
      "application/pdf";

    if (!isPdf) {
      setFormError(
        "Only PDF resume files are allowed."
      );

      return;
    }

    try {
      setFormError("");

      await uploadResume.mutateAsync(
        file
      );
    } catch (mutationError) {
      setFormError(
        getErrorMessage(
          mutationError
        )
      );
    } finally {
      if (
        resumeInputRef.current
      ) {
        resumeInputRef.current.value =
          "";
      }
    }
  };

  const handleDeleteResume =
    async () => {
      try {
        setFormError("");

        await deleteResume.mutateAsync();
      } catch (mutationError) {
        setFormError(
          getErrorMessage(
            mutationError
          )
        );
      }
    };

  const handleDownloadResume = async () => {
    if (!settings?.resume_url) {
      return;
    }

    try {
      setFormError("");
      setIsDownloadingResume(true);

      const response = await fetch(
        settings.resume_url
      );

      if (!response.ok) {
        throw new Error(
          "Failed to download resume"
        );
      }

      const blob =
        await response.blob();

      const pdfBlob = new Blob(
        [blob],
        {
          type: "application/pdf",
        }
      );

      const objectUrl =
        URL.createObjectURL(pdfBlob);

      const link =
        document.createElement("a");

      link.href = objectUrl;

      link.download =
        "Rohit-Kumar-Resume.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(
        objectUrl
      );
    } catch (downloadError) {
      console.error(
        "Resume download failed:",
        downloadError
      );

      setFormError(
        "Failed to download the resume. Please try again."
      );
    } finally {
      setIsDownloadingResume(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading site settings...
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Site Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your portfolio information,
          profile image, and resume.
        </p>
      </div>

      {formError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>
            {formError}
          </span>

          <button
            type="button"
            onClick={() =>
              setFormError("")
            }
            className="shrink-0"
            aria-label="Close error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* PROFILE IMAGE */}

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <User
                size={20}
                className="text-gray-700"
              />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Profile Image
              </h2>

              <p className="text-sm text-gray-500">
                Upload your portfolio profile photo.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              {settings?.profile_image_url ? (
                <img
                  src={
                    settings.profile_image_url
                  }
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  size={42}
                  className="text-gray-400"
                />
              )}
            </div>

            <input
              ref={
                profileImageInputRef
              }
              type="file"
              accept="image/*"
              onChange={
                handleProfileImageChange
              }
              className="hidden"
            />

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  profileImageInputRef.current?.click()
                }
                disabled={
                  uploadProfileImage.isPending
                }
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                <Upload size={17} />

                {uploadProfileImage.isPending
                  ? "Uploading..."
                  : settings?.profile_image_url
                    ? "Replace Image"
                    : "Upload Image"}
              </button>

              {settings?.profile_image_url && (
                <button
                  type="button"
                  onClick={
                    handleDeleteProfileImage
                  }
                  disabled={
                    deleteProfileImage.isPending
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={17} />

                  {deleteProfileImage.isPending
                    ? "Deleting..."
                    : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RESUME */}

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <FileText
                size={20}
                className="text-gray-700"
              />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Resume
              </h2>

              <p className="text-sm text-gray-500">
                Upload your latest resume as a PDF.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-6">
            {settings?.resume_url ? (
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <FileText
                    size={30}
                    className="text-gray-700"
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-gray-900">
                  Resume uploaded
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Your current resume is available.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={
                      handleDownloadResume
                    }
                    disabled={
                      isDownloadingResume
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Download size={17} />

                    {isDownloadingResume
                      ? "Downloading..."
                      : "Download Resume"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleDeleteResume
                    }
                    disabled={
                      deleteResume.isPending ||
                      isDownloadingResume
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={17} />

                    {deleteResume.isPending
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <FileText
                  size={38}
                  className="text-gray-400"
                />

                <p className="mt-3 text-sm text-gray-500">
                  No resume uploaded yet.
                </p>
              </div>
            )}

            <input
              ref={resumeInputRef}
              type="file"
              accept="application/pdf"
              onChange={
                handleResumeChange
              }
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                resumeInputRef.current?.click()
              }
              disabled={
                uploadResume.isPending ||
                isDownloadingResume
              }
              className="mx-auto mt-5 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <Upload size={17} />

              {uploadResume.isPending
                ? "Uploading..."
                : settings?.resume_url
                  ? "Replace Resume"
                  : "Upload Resume"}
            </button>
          </div>
        </div>
      </div>

      {/* GENERAL SETTINGS */}

      <form
        onSubmit={handleSave}
        className="rounded-xl border border-gray-200 bg-white"
      >
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            General Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            This information will be displayed
            across your portfolio.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="headline"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Headline
            </label>

            <input
              id="headline"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="Full Stack Developer"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="bio"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Bio
            </label>

            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={6}
              placeholder="Tell visitors about yourself..."
              className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Location
            </label>

            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Punjab, India"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="availability_status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Availability Status
            </label>

            <input
              id="availability_status"
              name="availability_status"
              value={
                formData.availability_status
              }
              onChange={handleChange}
              placeholder="Open to opportunities"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="current_focus"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Current Focus
            </label>

            <input
              id="current_focus"
              name="current_focus"
              value={
                formData.current_focus
              }
              onChange={handleChange}
              placeholder="What are you currently working on?"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            type="submit"
            disabled={
              updateSettings.isPending
            }
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            <Save size={17} />

            {updateSettings.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettingsPage;