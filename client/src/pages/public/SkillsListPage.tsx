import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { useSkills } from "../../hooks/useSkills";
import { RevealGroup, RevealItem, pageTransition } from "../../lib/motion";

const SkillsListPage = () => {
  const { data: skills, isLoading, isError } = useSkills();

  const sortedSkills = [...(skills ?? [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main>
          <section className="border-b border-slate-200 dark:border-slate-800">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-4 h-12 w-96 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <main>
          <section className="border-b border-slate-200 dark:border-slate-800">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
                <ArrowLeft size={17} />
                Back to Home
              </Link>
              <p className="mt-10 text-sm text-slate-500 dark:text-slate-400">
                Skills could not be loaded right now.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <motion.div initial={pageTransition.initial} animate={pageTransition.animate} transition={pageTransition.transition} className="bg-white dark:bg-slate-950">
      <Navbar />

      <main>
        <section className="border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            {/* Back button */}
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
              <ArrowLeft size={17} />
              Back to Home
            </Link>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-10 max-w-2xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Skills
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                Technical skills and tools.
              </h1>

              <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
                Technologies, programming languages, frameworks, tools, and
                other technical skills I have worked with throughout my
                learning and development journey.
              </p>
            </motion.div>

            {/* Skills */}
            {sortedSkills.length > 0 ? (
              <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
                {sortedSkills.map((skill) => (
                  <RevealItem key={skill.id}>
                    <article className="group h-full rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-950 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white">
                      {skill.category && (
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          {skill.category}
                        </p>
                      )}

                      <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        {skill.name}
                      </h2>
                    </article>
                  </RevealItem>
                ))}
              </RevealGroup>
            ) : (
              <div className="mt-14 rounded-xl border border-slate-200 p-8 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">
                  Skills have not been added yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default SkillsListPage;
