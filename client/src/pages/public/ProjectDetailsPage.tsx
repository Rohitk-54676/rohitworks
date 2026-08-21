import {
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import {
  Link,
  useParams,
} from "react-router-dom";

import { useProjectBySlug } from "../../hooks/useProjects";

const ProjectDetailsPage = () => {
  const { slug } = useParams();

  const {
    data: project,
    isLoading,
    isError,
  } = useProjectBySlug(slug ?? "");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-10 h-12 w-3/4 animate-pulse rounded bg-slate-200" />

          <div className="mt-6 h-24 w-full animate-pulse rounded bg-slate-200" />

          <div className="mt-12 aspect-[16/9] animate-pulse bg-slate-200" />
        </div>
      </main>
    );
  }

  if (isError || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-950">
            Project not found
          </h1>

          <p className="mt-3 text-slate-600">
            This project could not be loaded.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-950"
          >
            <ArrowLeft size={17} />
            Back to portfolio
          </Link>
        </div>
      </main>
    );
  }

  const formatDate = (date: string | null) => {
    if (!date) {
      return null;
    }

    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">

        {/* Back button */}

        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft size={17} />
          Back to projects
        </Link>

        {/* Header */}

        <header className="mt-12">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {project.status.replace("_", " " )}
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            {project.short_description}
          </p>

          {/* Technologies */}

          {project.technologies.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={technology.id}
                  className="border border-slate-200 px-3 py-1.5 text-sm text-slate-600"
                >
                  {technology.name}
                </span>
              ))}
            </div>
          )}

          {/* Links */}

          {(project.github_url || project.live_url) && (
            <div className="mt-8 flex flex-wrap gap-4">

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-300 px-5 py-3 text-sm font-medium text-slate-950 transition-colors hover:border-slate-950"
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
                  className="inline-flex items-center gap-2 bg-slate-950 px-5 py-3 text-sm font-medium text-white"
                >
                  <ExternalLink size={17} />
                  View Live Project
                </a>
              )}

            </div>
          )}

        </header>

        {/* Main image */}

        {project.thumbnail_url && (
          <div className="mt-16 overflow-hidden border border-slate-200">
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Project overview */}

        <section className="mt-16 border-t border-slate-200 pt-12">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Overview
          </p>

          <div className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-8 text-slate-700">
            {project.full_description}
          </div>

        </section>

        {/* Project dates */}

        {(project.start_date || project.end_date) && (
          <section className="mt-16 border-t border-slate-200 pt-12">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Timeline
            </p>

            <p className="mt-4 text-lg text-slate-700">

              {formatDate(project.start_date) ?? "Started"}

              {" — "}

              {formatDate(project.end_date) ?? "Present"}

            </p>

          </section>
        )}

        {/* Case study */}

        {(project.problem ||
          project.solution ||
          project.architecture ||
          project.challenges ||
          project.results ||
          project.lessons_learned) && (

          <section className="mt-16 border-t border-slate-200 pt-12">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Case Study
            </p>

            <div className="mt-10 space-y-12">

              {project.problem && (
                <CaseStudySection
                  title="Problem"
                  content={project.problem}
                />
              )}

              {project.solution && (
                <CaseStudySection
                  title="Solution"
                  content={project.solution}
                />
              )}

              {project.architecture && (
                <CaseStudySection
                  title="Architecture"
                  content={project.architecture}
                />
              )}

              {project.challenges && (
                <CaseStudySection
                  title="Challenges"
                  content={project.challenges}
                />
              )}

              {project.results && (
                <CaseStudySection
                  title="Results"
                  content={project.results}
                />
              )}

              {project.lessons_learned && (
                <CaseStudySection
                  title="Lessons Learned"
                  content={project.lessons_learned}
                />
              )}

            </div>

          </section>
        )}

        {/* Features */}

        {project.features &&
          project.features.length > 0 && (

            <section className="mt-16 border-t border-slate-200 pt-12">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Key Features
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">

                {project.features && (
                    <section>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                        Key Features
                        </h2>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {String(project.features)
                            .split(/\r?\n/)
                            .map((feature) => feature.trim())
                            .filter(Boolean)
                            .map((feature, index) => (
                            <div
                                key={`${feature}-${index}`}
                                className="border border-slate-200 p-4"
                            >
                                <p className="text-sm leading-6 text-slate-700">
                                {feature}
                                </p>
                            </div>
                            ))}
                        </div>
                    </section>
                    )}

              </ul>

            </section>
          )}

        {/* Additional project images */}

        {project.images.length > 0 && (

          <section className="mt-16 border-t border-slate-200 pt-12">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Project Gallery
            </p>

            <div className="mt-8 grid gap-6">

              {project.images
                .sort(
                  (a, b) =>
                    a.display_order -
                    b.display_order
                )
                .map((image) => (
                  <figure
                    key={image.id}
                    className="overflow-hidden border border-slate-200"
                  >

                    <img
                      src={image.url}
                      alt={
                        image.alt_text ||
                        `${project.title} preview`
                      }
                      className="w-full"
                    />

                    {image.alt_text && (
                      <figcaption className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
                        {image.alt_text}
                      </figcaption>
                    )}

                  </figure>
                ))}

            </div>

          </section>
        )}

      </div>
    </main>
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

      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>

      <div className="mt-4 whitespace-pre-line leading-8 text-slate-600">
        {content}
      </div>

    </div>
  );
};

export default ProjectDetailsPage;