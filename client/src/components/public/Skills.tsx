import { useSkills } from "../../hooks/useSkills";

const Skills = () => {
  const {
    data: skills,
    isLoading,
    isError,
  } = useSkills();

  if (isLoading) {
    return (
      <section
        id="skills"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-10 w-64 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
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
        id="skills"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm text-slate-500">
            Skills could not be loaded right now.
          </p>
        </div>
      </section>
    );
  }

  if (!skills || skills.length === 0) {
    return (
      <section
        id="skills"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Skills
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Technologies and tools.
            </h2>
          </div>

          <p className="mt-10 text-slate-500">
            Skills have not been added yet.
          </p>
        </div>
      </section>
    );
  }

  const sortedSkills = [...skills].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <section
      id="skills"
      className="border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Skills
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Technologies and tools I work with.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            A collection of technologies and tools used across my projects and
            continuous learning.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedSkills.map((skill) => (
            <article
              key={skill.id}
              className="group border border-slate-200 bg-white p-5 transition-colors hover:border-slate-950"
            >
              {skill.category && (
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {skill.category}
                </p>
              )}

              <h3 className="mt-3 text-lg font-semibold text-slate-950">
                {skill.name}
              </h3>

              {skill.icon_reference && (
                <p className="mt-2 truncate text-xs text-slate-400">
                  {skill.icon_reference}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;