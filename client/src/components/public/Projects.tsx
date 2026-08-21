import {
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useProjects } from "../../hooks/useProjects";

const Projects = () => {
  const navigate = useNavigate();

  const {
    data: projects,
    isLoading,
    isError,
  } = useProjects();

  if (isLoading) {
    return (
      <section
        id="projects"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-10 w-72 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden border border-slate-200"
              >
                <div className="aspect-[16/10] animate-pulse bg-slate-200" />

                <div className="space-y-4 p-6">
                  <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-16 animate-pulse rounded bg-slate-200" />
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
      <section
        id="projects"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm text-slate-500">
            Projects could not be loaded right now.
          </p>
        </div>
      </section>
    );
  }

  const featuredProjects = (projects ?? [])
    .filter((project) => project.featured)
    .sort(
      (a, b) =>
        a.display_order - b.display_order
    );

  if (featuredProjects.length === 0) {
    return (
      <section
        id="projects"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Projects
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Selected work and projects.
          </h2>

          <p className="mt-10 text-slate-500">
            Featured projects have not been added yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Projects
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Selected work built through practical experience.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              A selection of projects demonstrating my technical skills,
              problem-solving approach, and development experience.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
            {featuredProjects.length} featured
            <ArrowUpRight size={17} />
          </span>
        </div>

        {/* Projects */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <article
              key={project.id}
              onClick={() =>
                navigate(`/projects/${project.slug}`)
              }
              className="group cursor-pointer overflow-hidden border border-slate-200 bg-white transition-colors hover:border-slate-950"
            >
              {/* Thumbnail */}
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
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
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {project.status.replace("_", " ")}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                      {project.title}
                    </h3>
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="shrink-0 text-slate-400 transition-colors group-hover:text-slate-950"
                  />
                </div>

                <p className="mt-4 leading-7 text-slate-600">
                  {project.short_description}
                </p>

                {/* Technologies */}
                {project.technologies.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.map(
                      (technology) => (
                        <span
                          key={technology.id}
                          className="border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {technology.name}
                        </span>
                      )
                    )}
                  </div>
                )}

                {/* External links */}
                {(project.github_url ||
                  project.live_url) && (
                  <div className="mt-7 flex flex-wrap gap-5">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
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
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                      >
                        <ExternalLink size={17} />
                        Live Project
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;