import { GraduationCap } from "lucide-react";

import { useEducation } from "../../hooks/useEducation";

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

const Education = () => {
  const {
    data: education,
    isLoading,
    isError,
  } = useEducation();

  if (isLoading) {
    return (
      <section
        id="education"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-10 w-72 animate-pulse rounded bg-slate-200" />

          <div className="mt-12 space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse border border-slate-200 bg-slate-100"
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
        id="education"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm text-slate-500">
            Education could not be loaded right now.
          </p>
        </div>
      </section>
    );
  }

  const sortedEducation = [...(education ?? [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  if (sortedEducation.length === 0) {
    return (
      <section
        id="education"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Education
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Academic background and continuous learning.
          </h2>

          <p className="mt-10 text-slate-500">
            Education entries have not been added yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="education"
      className="border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Education
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Academic background and continuous learning.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            My formal education and the areas of study that support my
            technical development.
          </p>
        </div>

        {/* Education cards */}
        <div className="mt-12 grid gap-6">
          {sortedEducation.map((item) => {
            const startDate = formatDate(item.start_date);
            const endDate = formatDate(item.end_date);

            return (
              <article
                key={item.id}
                className="border border-slate-200 bg-white p-6 sm:p-8"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200">
                      <GraduationCap
                        size={21}
                        className="text-slate-950"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {item.institution}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                        {item.degree}
                      </h3>

                      {item.field && (
                        <p className="mt-2 text-sm text-slate-600">
                          {item.field}
                        </p>
                      )}
                    </div>
                  </div>

                  {(startDate || endDate) && (
                    <span className="w-fit whitespace-nowrap border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">
                      {startDate ?? "—"} —{" "}
                      {endDate ?? "Present"}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="mt-6 max-w-3xl leading-7 text-slate-600">
                    {item.description}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Education;