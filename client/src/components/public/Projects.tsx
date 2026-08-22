import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { useProjects } from "../../hooks/useProjects";
import { Reveal, RevealGroup, RevealItem } from "../../lib/motion";

const Projects = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <section id="projects" className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-10 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="aspect-[16/10] animate-pulse bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-4 p-6">
                  <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="projects" className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Projects could not be loaded right now.
          </p>
        </div>
      </section>
    );
  }

  const featuredProjects = (projects ?? [])
    .filter((project) => project.featured)
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 4);

  if (featuredProjects.length === 0) {
    return (
      <section id="projects" className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Featured Projects
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Selected work and projects.
          </h2>

          <p className="mt-10 text-slate-500 dark:text-slate-400">
            Featured projects have not been added yet.
          </p>

          <Link
            to="/projects"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-70 dark:text-white"
          >
            View All Projects
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Featured Projects
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Selected work built through practical experience.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              A selection of projects demonstrating my technical skills,
              problem-solving approach, and development experience.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-950 transition-opacity hover:opacity-70 dark:text-white sm:self-auto"
          >
            View All Projects
            <ArrowRight size={17} />
          </Link>
        </Reveal>

        {/* Projects */}
        <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-2" stagger={0.08}>
          {featuredProjects.map((project) => (
            <RevealItem key={project.id}>
              <article
                onClick={() => navigate(`/projects/${project.slug}`)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-950 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-8 text-center">
                      <span className="text-sm text-slate-400">
                        No project preview available
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        {project.status.replace("_", " ")}
                      </p>

                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        {project.title}
                      </h3>
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="shrink-0 text-slate-400 transition-colors group-hover:text-slate-950 dark:group-hover:text-white"
                    />
                  </div>

                  <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
                    {project.short_description}
                  </p>

                  {project.technologies.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology.id}
                          className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400"
                        >
                          {technology.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {(project.github_url || project.live_url) && (
                    <div className="mt-7 flex flex-wrap gap-5">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                        >
                          <FaGithub size={17} />
                          Source Code
                        </a>
                      )}

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                        >
                          <ExternalLink size={17} />
                          Live Project
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Bottom View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-slate-950 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-950 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-slate-950"
          >
            View All Projects
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
