import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useSkills } from "../../hooks/useSkills";
import { Reveal, RevealGroup, RevealItem } from "../../lib/motion";

const Skills = () => {
  const { data: skills, isLoading, isError } = useSkills();

  if (isLoading) {
    return (
      <section id="skills" className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-10 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="min-h-56 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="skills" className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Skills could not be loaded right now.
          </p>
        </div>
      </section>
    );
  }

  if (!skills || skills.length === 0) {
    return (
      <section id="skills" className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Skills
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Technologies and tools.
            </h2>
          </div>
          <p className="mt-10 text-slate-500 dark:text-slate-400">
            Skills have not been added yet.
          </p>
        </div>
      </section>
    );
  }

  const sortedSkills = [...skills].sort((a, b) => a.display_order - b.display_order);

  const skillsByCategory = sortedSkills.reduce<Record<string, typeof sortedSkills>>(
    (categories, skill) => {
      const category = skill.category?.trim() || "Other";
      if (!categories[category]) categories[category] = [];
      categories[category].push(skill);
      return categories;
    },
    {}
  );

  const categories = Object.entries(skillsByCategory).slice(0, 6);

  return (
    <section id="skills" className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Skills
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Technologies and tools I work with.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
            A collection of technologies, programming languages, tools, and
            platforms used across my projects and continuous learning.
          </p>
        </Reveal>

        {/* Skill Categories */}
        <RevealGroup
          className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {categories.map(([category, categorySkills]) => (
            <RevealItem key={category}>
              <article className="flex h-full min-h-56 flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-950 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {category}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] dark:border-slate-700 dark:text-slate-300"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* View All */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 rounded-full border border-slate-950 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-950 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-slate-950"
          >
            View All Skills
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Skills;
