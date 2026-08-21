import { useState } from "react";
import { ArrowDownRight, Download, MapPin } from "lucide-react";

import { useSiteSettings } from "../../hooks/useSiteSettings";

const Hero = () => {
  const {
    data: settings,
    isLoading,
    isError,
  } = useSiteSettings();

  const [isDownloading, setIsDownloading] = useState(false);

  if (isLoading) {
    return (
      <section
        id="home"
        className="border-b border-slate-200"
        aria-label="Loading portfolio introduction"
      >
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="space-y-6">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

            <div className="space-y-3">
              <div className="h-12 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-12 w-4/5 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="h-20 w-full animate-pulse rounded bg-slate-200" />

            <div className="flex gap-3">
              <div className="h-11 w-36 animate-pulse rounded bg-slate-200" />
              <div className="h-11 w-36 animate-pulse rounded bg-slate-200" />
            </div>
          </div>

          <div className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </section>
    );
  }

  if (isError || !settings) {
    return (
      <section
        id="home"
        className="border-b border-slate-200"
      >
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Portfolio
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Rohit Kumar
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Building practical software projects and continuously improving
              as a developer.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const scrollToProjects = () => {
    document
      .getElementById("projects")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const handleResumeDownload = async () => {
    if (!settings.resume_url || isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);

      const response = await fetch(settings.resume_url);

      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(
        new Blob([blob], {
          type: "application/pdf",
        })
      );

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = "Rohit-Kumar-Resume.pdf";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      window.setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.error("Resume download failed:", error);

      window.open(
        settings.resume_url,
        "_blank",
        "noopener,noreferrer"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section
      id="home"
      className="overflow-hidden border-b border-slate-200"
    >
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
        {/* Main content */}
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {settings.availability_status && (
              <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700">
                {settings.availability_status}
              </span>
            )}

            {settings.location && (
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <MapPin size={16} />
                {settings.location}
              </span>
            )}
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {settings.name || "Rohit Kumar"}
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
            {settings.headline ||
              "Building practical digital experiences with modern web technologies."}
          </h1>

          {settings.bio && (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {settings.bio}
            </p>
          )}

          {settings.current_focus && (
            <p className="mt-5 text-sm leading-6 text-slate-500">
              <span className="font-semibold text-slate-700">
                Current focus:
              </span>{" "}
              {settings.current_focus}
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToProjects}
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              View My Work
              <ArrowDownRight size={17} />
            </button>

            {settings.resume_url && (
              <button
                type="button"
                onClick={handleResumeDownload}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 border border-slate-300 px-5 py-3 text-sm font-medium text-slate-950 transition-colors hover:border-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={17} />

                {isDownloading
                  ? "Downloading..."
                  : "Download Resume"}
              </button>
            )}

            <a
              href="#contact"
              className="px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* Profile image */}
        <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:max-w-none">
          <div className="absolute -inset-4 border border-slate-200 sm:-inset-6" />

          <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
            {settings.profile_image_url ? (
              <img
                src={settings.profile_image_url}
                alt={
                  settings.name
                    ? `${settings.name} professional profile`
                    : "Rohit Kumar professional profile"
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <p className="text-sm text-slate-500">
                  Profile image will appear here.
                </p>
              </div>
            )}
          </div>

          <div className="absolute -bottom-5 -left-3 max-w-[220px] border border-slate-200 bg-white p-4 shadow-sm sm:-left-6">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Professional Portfolio
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              Projects, development work, technical growth, and professional
              progress.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;