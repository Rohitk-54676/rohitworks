import { BriefcaseBusiness, MapPin } from "lucide-react";

import { useExperiences } from "../../hooks/useExperience";

const formatDate = (date: string | null | undefined) => {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const Experience = () => {
  const {
    data: experiences,
    isLoading,
    isError,
  } = useExperiences();

  if (isLoading) {
    return (
      <section
        id="experience"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-10 w-80 animate-pulse rounded bg-slate-200" />

          <div className="mt-12 space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        id="experience"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm text-slate-500">
            Experience could not be loaded right now.
          </p>
        </div>
      </section>
    );
  }

  const sortedExperiences = Array.isArray(experiences)
    ? [...experiences].sort(
        (a, b) =>
          (a.display_order ?? 0) -
          (b.display_order ?? 0)
      )
    : [];

  if (sortedExperiences.length === 0) {
    return (
      <section
        id="experience"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Experience
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Professional experience and practical work.
          </h2>

          <p className="mt-10 text-slate-500">
            Experience entries have not been added yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="experience"
      className="border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Experience
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Professional experience and practical work.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Roles, responsibilities, technologies, and experiences that have
            contributed to my professional growth.
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-12 border-l border-slate-200">
          {sortedExperiences.map((experience) => {
            const technologies = Array.isArray(
              experience.technologies
            )
              ? experience.technologies
              : [];

            const startDate = formatDate(
              experience.start_date
            );

            const endDate = formatDate(
              experience.end_date
            );

            return (
              <article
                key={experience.id}
                className="relative border-b border-slate-200 py-8 pl-8 first:pt-0 last:border-b-0 last:pb-0 sm:pl-12"
              >
                {/* Timeline marker */}
                <span className="absolute left-[-5px] top-10 h-2.5 w-2.5 rounded-full bg-slate-950" />

                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <BriefcaseBusiness size={17} />

                      <p className="text-sm font-medium">
                        {experience.organization}
                      </p>
                    </div>

                    <h3 className="mt-3 text-xl font-semibold text-slate-950 sm:text-2xl">
                      {experience.role}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                      {(startDate ||
                        endDate ||
                        experience.is_current) && (
                        <span>
                          {startDate ?? "—"} —{" "}
                          {experience.is_current
                            ? "Present"
                            : endDate ?? "Present"}
                        </span>
                      )}

                      {experience.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={15} />
                          {experience.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {experience.is_current === true && (
                    <span className="w-fit border border-slate-300 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                      Current
                    </span>
                  )}
                </div>

                {experience.description && (
                  <p className="mt-6 max-w-3xl leading-7 text-slate-600">
                    {experience.description}
                  </p>
                )}

                {experience.achievements && (
                  <div className="mt-6 border-l-2 border-slate-950 pl-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Key achievements
                    </p>

                    <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-700">
                      {experience.achievements}
                    </p>
                  </div>
                )}

                {/* Technologies */}
                {technologies.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {technologies.map(
                      (technology, index) => (
                        <span
                          key={
                            technology.id ??
                            `${technology.name}-${index}`
                          }
                          className="border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {technology.name}
                        </span>
                      )
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;