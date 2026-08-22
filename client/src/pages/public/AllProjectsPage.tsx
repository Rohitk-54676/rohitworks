import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

import { useProjects } from "../../hooks/useProjects";

const AllProjectsPage = () => {
  const {
    data: projects,
    isLoading,
    isError,
  } = useProjects();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-12 w-80 animate-pulse rounded bg-slate-200" />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <p className="mt-10 text-sm text-slate-500">
            Projects could not be loaded right now.
          </p>
        </div>
      </main>
    );
  }

  const sortedProjects = [...(projects ?? [])].sort(
    (a, b) =>
      (a.display_order ?? 0) -
      (b.display_order ?? 0)
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Heading */}
        <div className="mt-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Projects
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            All projects.
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-600">
            A collection of projects built to explore ideas, solve problems,
            and strengthen my development skills.
          </p>
        </div>

        {/* Empty state */}
        {sortedProjects.length === 0 ? (
          <p className="mt-12 text-slate-500">
            No projects have been added yet.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col overflow-hidden border border-slate-200 bg-white transition-colors hover:border-slate-950"
              >
                {/* Project image */}
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
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
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {project.status}
                    </p>
                  )}

                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    {project.title}
                  </h2>

                  {project.short_description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                      {project.short_description}
                    </p>
                  )}

                  <div className="mt-6">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                    >
                      View project
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AllProjectsPage;