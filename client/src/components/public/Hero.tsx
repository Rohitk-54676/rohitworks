import { useState } from "react";
import { ArrowDownRight, Download, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import { useSiteSettings } from "../../hooks/useSiteSettings";
import WebGLBackground from "../three/WebGLBackground";
import SilentBoundary from "../three/SilentBoundary";

const Hero = () => {
  const { data: settings, isLoading, isError } = useSiteSettings();
  const [isDownloading, setIsDownloading] = useState(false);

  if (isLoading) {
    return (
      <section
        id="home"
        className="border-b border-slate-200 dark:border-slate-800"
        aria-label="Loading portfolio introduction"
      >
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="space-y-6">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-3">
              <div className="h-12 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-20 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="flex gap-3">
              <div className="h-11 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-11 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </section>
    );
  }

  if (isError || !settings) {
    return (
      <section id="home" className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Rohit Kumar
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
              Full-Stack Developer Building Modern Web Applications
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              I build practical, scalable web applications and enjoy turning
              ideas into functional products.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResumeDownload = async () => {
    if (!settings.resume_url || isDownloading) return;

    try {
      setIsDownloading(true);
      const response = await fetch(settings.resume_url);
      if (!response.ok) throw new Error("Failed to download resume");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Rohit-Kumar-Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error("Resume download failed:", error);
      window.open(settings.resume_url, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent)] dark:border-slate-800 dark:bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent)]"
    >
      {/* Ambient 3D particle field — silently disables itself on unsupported devices */}
      <SilentBoundary>
        <WebGLBackground className="pointer-events-none absolute inset-0 z-0 opacity-70" />
      </SilentBoundary>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
        {/* Main content */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 text-sm"
          >
            {settings.availability_status && (
              <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300">
                {settings.availability_status}
              </span>
            )}
            {settings.location && (
              <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <MapPin size={16} />
                {settings.location}
              </span>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
          >
            {settings.name || "Rohit Kumar"}
          </motion.p>

          {/* Headline — animated word-by-word for a stronger entrance */}
          <h1 className="mt-4 flex flex-wrap text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl dark:text-white">
            {(
              settings.headline ||
              "Full-Stack Developer Building Modern Web Applications"
            )
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.25 + index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mr-[0.25em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400"
          >
            I build practical, scalable web applications and enjoy turning
            ideas into functional products.
          </motion.p>

          {settings.current_focus && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.62 }}
              className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Current focus:
              </span>{" "}
              {settings.current_focus}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToProjects}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              View My Work
              <ArrowDownRight size={17} />
            </motion.button>

            {settings.resume_url && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleResumeDownload}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-medium text-slate-950 transition-colors hover:border-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-white dark:hover:border-white"
              >
                <Download size={17} />
                {isDownloading ? "Downloading..." : "Download Resume"}
              </motion.button>
            )}

            <a
              href="#contact"
              className="px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
            >
              Contact Me
            </a>
          </motion.div>
        </div>

        {/* Profile image */}
        <motion.div
          className="relative mx-auto w-full max-w-md lg:ml-auto lg:max-w-none"
          initial={{ opacity: 0, scale: 0.9, rotate: -1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -inset-4 rounded-2xl border border-slate-200 sm:-inset-6 dark:border-slate-700" />

          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
            {settings.profile_image_url ? (
              <motion.img
                src={settings.profile_image_url}
                alt={
                  settings.name
                    ? `${settings.name} professional profile`
                    : "Rohit Kumar professional profile"
                }
                initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Profile image will appear here.
                </p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="absolute -bottom-5 -left-3 max-w-[220px] rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:-left-6 dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Professional Portfolio
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              Projects, development work, technical growth, and professional
              progress.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
