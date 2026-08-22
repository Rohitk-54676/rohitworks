import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { useSkills } from "../../hooks/useSkills";

const SkillsListPage = () => {
  const {
    data: skills,
    isLoading,
    isError,
  } = useSkills();

  const sortedSkills = [...(skills ?? [])].sort(
    (a, b) =>
      (a.display_order ?? 0) -
      (b.display_order ?? 0)
  );

  if (isLoading) {
    return (
      <>
        <Navbar />

        <main>
          <section className="border-b border-slate-200">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
              {/* Heading skeleton */}
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

              <div className="mt-4 h-12 w-96 max-w-full animate-pulse rounded bg-slate-200" />

              {/* Skills skeleton */}
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-40 animate-pulse border border-slate-200 bg-slate-100"
                    />
                  )
                )}
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
          <section className="border-b border-slate-200">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              >
                <ArrowLeft size={17} />
                Back to Home
              </Link>

              <p className="mt-10 text-sm text-slate-500">
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
    <>
      <Navbar />

      <main>
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

            {/* Back button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              <ArrowLeft size={17} />
              Back to Home
            </Link>

            {/* Heading */}
            <div className="mt-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Skills
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Technical skills and tools.
              </h1>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Technologies, programming languages, frameworks, tools,
                and other technical skills I have worked with throughout
                my learning and development journey.
              </p>
            </div>

            {/* Skills */}
            {sortedSkills.length > 0 ? (
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedSkills.map((skill) => (
                  <article
                    key={skill.id}
                    className="group border border-slate-200 bg-white p-6 transition-colors hover:border-slate-950"
                  >
                    {skill.category && (
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {skill.category}
                      </p>
                    )}

                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                      {skill.name}
                    </h2>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-14 border border-slate-200 p-8">
                <p className="text-slate-500">
                  Skills have not been added yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SkillsListPage;