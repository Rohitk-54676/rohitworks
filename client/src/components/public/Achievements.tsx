import {
  Award,
  ExternalLink,
} from "lucide-react";

import { useAchievements } from "../../hooks/useAchievements";

const formatDate = (
  date: string | null | undefined
) => {
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

const Achievements = () => {
  const {
    data: achievements,
    isLoading,
    isError,
  } = useAchievements();

  if (isLoading) {
    return (
      <section
        id="achievements"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-10 w-80 animate-pulse rounded bg-slate-200" />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse border border-slate-200 bg-slate-100"
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        id="achievements"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm text-slate-500">
            Achievements could not be loaded right now.
          </p>
        </div>
      </section>
    );
  }

  const sortedAchievements = Array.isArray(
    achievements
  )
    ? [...achievements].sort(
        (a, b) =>
          (a.display_order ?? 0) -
          (b.display_order ?? 0)
      )
    : [];

  if (sortedAchievements.length === 0) {
    return (
      <section
        id="achievements"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Achievements
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Milestones and accomplishments.
          </h2>

          <p className="mt-10 text-slate-500">
            Achievement entries have not been added yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="achievements"
      className="border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Achievements
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Milestones and accomplishments.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Selected achievements, competitions, recognitions,
            and milestones from my academic and professional journey.
          </p>
        </div>

        {/* Achievement cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sortedAchievements.map((achievement) => {
            const achievementDate = formatDate(
              achievement.achievement_date
            );

            return (
              <article
                key={achievement.id}
                className="group overflow-hidden border border-slate-200 bg-white transition-colors hover:border-slate-950"
              >
                {/* Media */}
                {achievement.media_url ? (
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={achievement.media_url}
                      alt={achievement.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center bg-slate-100">
                    <Award
                      size={38}
                      className="text-slate-400"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {achievement.organization && (
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {achievement.organization}
                        </p>
                      )}

                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                        {achievement.title}
                      </h3>
                    </div>

                    {achievementDate && (
                      <span className="shrink-0 text-xs text-slate-500">
                        {achievementDate}
                      </span>
                    )}
                  </div>

                  {achievement.description && (
                    <p className="mt-4 leading-7 text-slate-600">
                      {achievement.description}
                    </p>
                  )}

                  {achievement.proof_url && (
                    <a
                      href={achievement.proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                    >
                      View Proof
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;