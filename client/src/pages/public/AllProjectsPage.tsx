import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { useProjects } from "../../hooks/useProjects";
import { RevealGroup, RevealItem, pageTransition } from "../../lib/motion";

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  planned: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-900",
  archived: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

const AllProjectsPage = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading, isError } = useProjects();

  const sortedProjects = [...(projects ?? [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  if (isLoading) {
    return (
      <motion.div initial={pageTransition.initial} animate={pageTransition.animate} transition={pageTransition.transition} className="bg-white dark:bg-slate-950">
        <Navbar />
        <main className="min-h-screen">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-12 w-80 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div initial={pageTransition.initial} animate={pageTransition.animate} transition={pageTransition.transition} className="bg-white dark:bg-slate-950">
        <Navbar />
        <main className="min-h-screen">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
              <ArrowLeft size={16} />
              Back to home
            </Link>
            <p className="mt-10 text-sm text-slate-500 dark:text-slate-400">
              Projects could not be loaded right now.
            </p>
          </div>
        </main>
        <Footer />
      </motion.div>
    );
  }

  return (
    <motion.div initial={pageTransition.initial} animate={pageTransition.animate} transition={pageTransition.transition} className="bg-white dark:bg-slate-950">
      <Navbar />

      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          {/* Back */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-12 max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Projects
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              All projects.
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
              A collection of projects built to explore ideas, solve problems,
              and strengthen my development skills.
            </p>
          </motion.div>

          {/* Empty state */}
          {sortedProjects.length === 0 ? (
            <p className="mt-12 text-slate-500 dark:text-slate-400">
              No projects have been added yet.
            </p>
          ) : (
            <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {sortedProjects.map((project) => (
                <RevealItem key={project.id}>
                  <article
                    onClick={() => navigate(`/projects/${project.slug}`)}
                    className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-950 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white"
                  >
                    {/* Project image */}
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          No project image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      {project.status && (
                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                            statusStyles[project.status] ?? "border-slate-200 text-slate-500 dark:border-slate-700"
                          }`}
                        >
                          {project.status.replace("_", " ")}
                        </span>
                      )}

                      <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        {project.title}
                      </h2>

                      {project.short_description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                          {project.short_description}
                        </p>
                      )}

                      {project.technologies.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span key={tech.id} className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div className="flex gap-4">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                              aria-label="View source code"
                            >
                              <FaGithub size={16} />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                              aria-label="View live project"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 transition-colors group-hover:text-slate-950 dark:text-slate-300 dark:group-hover:text-white">
                          View project
                          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default AllProjectsPage;
