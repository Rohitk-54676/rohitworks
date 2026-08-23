import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { useProjectBySlug } from "../../hooks/useProjects";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  pageTransition,
} from "../../lib/motion";

const ProjectDetailsPage = () => {
  const { slug } = useParams();

  const {
    data: project,
    isLoading,
    isError,
  } = useProjectBySlug(slug ?? "");

  if (isLoading) {
    return (
      <motion.div
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        transition={pageTransition.transition}
        className="bg-white dark:bg-slate-950"
      >
        <Navbar />

        <main className="min-h-screen">
          <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            <div className="mt-10 h-12 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            <div className="mt-6 h-24 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            <div className="mt-12 aspect-[16/9] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </main>

        <Footer />
      </motion.div>
    );
  }

  if (isError || !project) {
    return (
      <motion.div
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        transition={pageTransition.transition}
        className="bg-white dark:bg-slate-950"
      >
        <Navbar />

        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">
              Project not found
            </h1>

            <p className="mt-3 text-slate-600 dark:text-slate-400">
              This project could not be loaded.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white"
            >
              <ArrowLeft size={17} />
              Back to portfolio
            </Link>
          </div>
        </main>

        <Footer />
      </motion.div>
    );
  }

  const formatDate = (
    date: string | null
  ) => {
    if (!date) return null;

    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  };

  const hasCaseStudy =
    project.problem ||
    project.solution ||
    project.architecture ||
    project.challenges ||
    project.results ||
    project.lessons_learned;

  /*
   * Backend stores features as a newline-separated string.
   * Convert it into a string array once before rendering.
   */
 const features: string[] = Array.isArray(project.features)
  ? project.features
  : [];

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
      className="bg-white dark:bg-slate-950"
    >
      <Navbar />

      <main className="min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          
          {/* Back button */}

          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to projects
          </Link>

          {/* Header */}

          <Reveal>
            <header className="mt-12">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                {project.status.replace("_", " ")}
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                {project.title}
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                {project.short_description}
              </p>

              {/* Technologies */}

              {project.technologies.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {project.technologies.map(
                    (technology) => (
                      <span
                        key={technology.id}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400"
                      >
                        {technology.name}
                      </span>
                    )
                  )}
                </div>
              )}

              {/* Links */}

              {(project.github_url ||
                project.live_url) && (
                <div className="mt-8 flex flex-wrap gap-4">
                  
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-950 transition-colors hover:border-slate-950 dark:border-slate-700 dark:text-white dark:hover:border-white"
                    >
                      <FaGithub size={17} />
                      View Source
                    </a>
                  )}

                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                      <ExternalLink size={17} />
                      View Live Project
                    </a>
                  )}
                </div>
              )}
            </header>
          </Reveal>

          {/* Main image */}

          {project.thumbnail_url && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
                margin: "-60px",
              }}
              transition={{
                duration: 0.5,
              }}
              className="mt-16 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
            >
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full object-cover"
              />
            </motion.div>
          )}

          {/* Project overview */}

          <Reveal>
            <section className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Overview
              </p>

              <div className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-8 text-slate-700 dark:text-slate-300">
                {project.full_description}
              </div>
            </section>
          </Reveal>

          {/* Project dates */}

          {(project.start_date ||
            project.end_date) && (
            <Reveal>
              <section className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  Timeline
                </p>

                <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">
                  {formatDate(
                    project.start_date
                  ) ?? "Started"}{" "}
                  —{" "}
                  {formatDate(
                    project.end_date
                  ) ?? "Present"}
                </p>
              </section>
            </Reveal>
          )}

          {/* Case study */}

          {hasCaseStudy && (
            <section className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  Case Study
                </p>
              </Reveal>

              <RevealGroup
                className="mt-10 space-y-12"
                stagger={0.08}
              >
                {project.problem && (
                  <RevealItem>
                    <CaseStudySection
                      title="Problem"
                      content={project.problem}
                    />
                  </RevealItem>
                )}

                {project.solution && (
                  <RevealItem>
                    <CaseStudySection
                      title="Solution"
                      content={project.solution}
                    />
                  </RevealItem>
                )}

                {project.architecture && (
                  <RevealItem>
                    <CaseStudySection
                      title="Architecture"
                      content={project.architecture}
                    />
                  </RevealItem>
                )}

                {project.challenges && (
                  <RevealItem>
                    <CaseStudySection
                      title="Challenges"
                      content={project.challenges}
                    />
                  </RevealItem>
                )}

                {project.results && (
                  <RevealItem>
                    <CaseStudySection
                      title="Results"
                      content={project.results}
                    />
                  </RevealItem>
                )}

                {project.lessons_learned && (
                  <RevealItem>
                    <CaseStudySection
                      title="Lessons Learned"
                      content={
                        project.lessons_learned
                      }
                    />
                  </RevealItem>
                )}
              </RevealGroup>
            </section>
          )}

          {/* Key Features */}

          {features.length > 0 && (
            <section className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  Key Features
                </p>
              </Reveal>

              <RevealGroup
                className="mt-6 grid gap-3 sm:grid-cols-2"
                stagger={0.04}
              >
                {features.map(
                  (
                    feature: string,
                    index: number
                  ) => (
                    <RevealItem
                      key={`${feature}-${index}`}
                    >
                      <div className="h-full rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                          {feature}
                        </p>
                      </div>
                    </RevealItem>
                  )
                )}
              </RevealGroup>
            </section>
          )}

          {/* Additional project images */}

          {project.images.length > 0 && (
            <section className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  Project Gallery
                </p>
              </Reveal>

              <RevealGroup
                className="mt-8 grid gap-6"
                stagger={0.08}
              >
                {project.images
                  .slice()
                  .sort(
                    (a, b) =>
                      a.display_order -
                      b.display_order
                  )
                  .map((image) => (
                    <RevealItem
                      key={image.id}
                    >
                      <figure className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                        <img
                          src={image.url}
                          alt={
                            image.alt_text ||
                            `${project.title} preview`
                          }
                          className="w-full"
                        />

                        {image.alt_text && (
                          <figcaption className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            {image.alt_text}
                          </figcaption>
                        )}
                      </figure>
                    </RevealItem>
                  ))}
              </RevealGroup>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

interface CaseStudySectionProps {
  title: string;
  content: string;
}

const CaseStudySection = ({
  title,
  content,
}: CaseStudySectionProps) => {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {title}
      </h2>

      <div className="mt-4 whitespace-pre-line leading-8 text-slate-600 dark:text-slate-400">
        {content}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;