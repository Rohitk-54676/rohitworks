import { useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  ChevronRight,
  ExternalLink,
  FileBadge,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useAchievements } from "../../hooks/useAchievements";
import { useCertifications } from "../../hooks/useCertifications";
import { useExperiences } from "../../hooks/useExperience";
import { useEducation } from "../../hooks/useEducation";
import { Reveal, RevealGroup, RevealItem } from "../../lib/motion";

type JourneyTab = "achievements" | "certifications" | "experience" | "education";

const formatDate = (date: string | null | undefined) => {
  if (!date) return null;
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(parsedDate);
};

const tabs: { id: JourneyTab; label: string }[] = [
  { id: "achievements", label: "Achievements" },
  { id: "certifications", label: "Certifications" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
];

const ProfessionalJourney = () => {
  const [activeTab, setActiveTab] = useState<JourneyTab>("achievements");

  const achievementsQuery = useAchievements();
  const certificationsQuery = useCertifications();
  const experiencesQuery = useExperiences();
  const educationQuery = useEducation();

  const sortedAchievements = Array.isArray(achievementsQuery.data)
    ? [...achievementsQuery.data]
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .slice(0, 4)
    : [];

  const sortedCertifications = Array.isArray(certificationsQuery.data)
    ? [...certificationsQuery.data].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
      )
    : [];

  const visibleCertifications = sortedCertifications.slice(0, 3);

  const sortedExperiences = Array.isArray(experiencesQuery.data)
    ? [...experiencesQuery.data].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
      )
    : [];

  const sortedEducation = [...(educationQuery.data ?? [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  const isLoading =
    (activeTab === "achievements" && achievementsQuery.isLoading) ||
    (activeTab === "certifications" && certificationsQuery.isLoading) ||
    (activeTab === "experience" && experiencesQuery.isLoading) ||
    (activeTab === "education" && educationQuery.isLoading);

  const hasError =
    (activeTab === "achievements" && achievementsQuery.isError) ||
    (activeTab === "certifications" && certificationsQuery.isError) ||
    (activeTab === "experience" && experiencesQuery.isError) ||
    (activeTab === "education" && educationQuery.isError);

  return (
    <section id="journey" className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Professional Journey
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Experience, learning, and milestones.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
            A closer look at the experiences, achievements, certifications,
            and education that have shaped my development.
          </p>
        </Reveal>

        {/* Tabs */}
        <div className="mt-10 overflow-x-auto">
          <div className="relative inline-flex min-w-max rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5"
                >
                  {isActive && (
                    <motion.span
                      layoutId="journey-tab-pill"
                      className="absolute inset-0 rounded-full bg-slate-950 dark:bg-white"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      isActive
                        ? "text-white dark:text-slate-950"
                        : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && hasError && (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This information could not be loaded right now.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isLoading && !hasError && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* ACHIEVEMENTS */}
              {activeTab === "achievements" && (
                sortedAchievements.length === 0 ? (
                  <p className="mt-10 text-slate-500 dark:text-slate-400">
                    Achievement entries have not been added yet.
                  </p>
                ) : (
                  <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2" stagger={0.08}>
                    {sortedAchievements.map((achievement) => {
                      const achievementDate = formatDate(achievement.achievement_date);
                      return (
                        <RevealItem key={achievement.id}>
                          <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-950 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white">
                            {achievement.media_url ? (
                              <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={achievement.media_url}
                                  alt={achievement.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                              </div>
                            ) : (
                              <div className="flex aspect-[16/9] items-center justify-center bg-slate-100 dark:bg-slate-800">
                                <Award size={38} className="text-slate-400" />
                              </div>
                            )}

                            <div className="p-6">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  {achievement.organization && (
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                      {achievement.organization}
                                    </p>
                                  )}
                                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                                    {achievement.title}
                                  </h3>
                                </div>

                                {achievementDate && (
                                  <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                                    {achievementDate}
                                  </span>
                                )}
                              </div>

                              {achievement.description && (
                                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
                                  {achievement.description}
                                </p>
                              )}

                              {achievement.proof_url && (
                                <a
                                  href={achievement.proof_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                                >
                                  View Proof
                                  <ExternalLink size={16} />
                                </a>
                              )}
                            </div>
                          </article>
                        </RevealItem>
                      );
                    })}
                  </RevealGroup>
                )
              )}

              {/* CERTIFICATIONS */}
              {activeTab === "certifications" && (
                visibleCertifications.length === 0 ? (
                  <p className="mt-10 text-slate-500 dark:text-slate-400">
                    Certification entries have not been added yet.
                  </p>
                ) : (
                  <>
                    <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
                      {visibleCertifications.map((certification) => {
                        const issueDate = formatDate(certification.issue_date);
                        return (
                          <RevealItem key={certification.id}>
                            <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-950 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white">
                              {certification.certificate_image_url ? (
                                <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                  <img
                                    src={certification.certificate_image_url}
                                    alt={certification.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                  />
                                </div>
                              ) : (
                                <div className="flex aspect-[16/10] items-center justify-center bg-slate-100 dark:bg-slate-800">
                                  <Award size={40} className="text-slate-400" />
                                </div>
                              )}

                              <div className="p-6">
                                {certification.issuing_organization && (
                                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                    {certification.issuing_organization}
                                  </p>
                                )}

                                <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                                  {certification.title}
                                </h3>

                                {issueDate && (
                                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                    Issued {issueDate}
                                  </p>
                                )}

                                {certification.credential_id && (
                                  <div className="mt-5 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <FileBadge size={16} className="mt-0.5 shrink-0" />
                                    <span>Credential ID: {certification.credential_id}</span>
                                  </div>
                                )}

                                {certification.credential_url && (
                                  <a
                                    href={certification.credential_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                                  >
                                    Verify Credential
                                    <ExternalLink size={16} />
                                  </a>
                                )}
                              </div>
                            </article>
                          </RevealItem>
                        );
                      })}
                    </RevealGroup>

                    {sortedCertifications.length > 3 && (
                      <div className="mt-10 flex justify-center">
                        <a
                          href="/certifications"
                          className="inline-flex items-center gap-2 rounded-full border border-slate-950 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-950 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-slate-950"
                        >
                          View More Certifications
                          <ChevronRight size={18} />
                        </a>
                      </div>
                    )}
                  </>
                )
              )}

              {/* EXPERIENCE */}
              {activeTab === "experience" && (
                sortedExperiences.length === 0 ? (
                  <p className="mt-10 text-slate-500 dark:text-slate-400">
                    Experience entries have not been added yet.
                  </p>
                ) : (
                  <RevealGroup className="mt-10 border-l border-slate-200 dark:border-slate-800" stagger={0.1}>
                    {sortedExperiences.map((experience) => {
                      const technologies = Array.isArray(experience.technologies)
                        ? experience.technologies
                        : [];
                      const startDate = formatDate(experience.start_date);
                      const endDate = formatDate(experience.end_date);

                      return (
                        <RevealItem key={experience.id}>
                          <article className="relative border-b border-slate-200 py-8 pl-8 first:pt-0 last:border-b-0 last:pb-0 dark:border-slate-800 sm:pl-12">
                            <span className="absolute left-[-5px] top-10 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />

                            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                              <div>
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                  <BriefcaseBusiness size={17} />
                                  <p className="text-sm font-medium">{experience.organization}</p>
                                </div>

                                <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white sm:text-2xl">
                                  {experience.role}
                                </h3>

                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                  {(startDate || endDate || experience.is_current) && (
                                    <span>
                                      {startDate ?? "—"} — {experience.is_current ? "Present" : endDate ?? "Present"}
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
                                <span className="w-fit rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                  Current
                                </span>
                              )}
                            </div>

                            {experience.description && (
                              <p className="mt-6 max-w-3xl leading-7 text-slate-600 dark:text-slate-400">
                                {experience.description}
                              </p>
                            )}

                            {experience.achievements && (
                              <div className="mt-6 border-l-2 border-[var(--accent)] pl-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                  Key achievements
                                </p>
                                <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">
                                  {experience.achievements}
                                </p>
                              </div>
                            )}

                            {technologies.length > 0 && (
                              <div className="mt-6 flex flex-wrap gap-2">
                                {technologies.map((technology, index) => (
                                  <span
                                    key={technology.id ?? `${technology.name}-${index}`}
                                    className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400"
                                  >
                                    {technology.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </article>
                        </RevealItem>
                      );
                    })}
                  </RevealGroup>
                )
              )}

              {/* EDUCATION */}
              {activeTab === "education" && (
                sortedEducation.length === 0 ? (
                  <p className="mt-10 text-slate-500 dark:text-slate-400">
                    Education entries have not been added yet.
                  </p>
                ) : (
                  <RevealGroup className="mt-10 grid gap-6" stagger={0.08}>
                    {sortedEducation.map((item) => {
                      const startDate = formatDate(item.start_date);
                      const endDate = formatDate(item.end_date);

                      return (
                        <RevealItem key={item.id}>
                          <article className="rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700">
                                  <GraduationCap size={21} className="text-[var(--accent)]" />
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {item.institution}
                                  </p>
                                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                                    {item.degree}
                                  </h3>
                                  {item.field && (
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                      {item.field}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {(startDate || endDate) && (
                                <span className="w-fit whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                  {startDate ?? "—"} — {endDate ?? "Present"}
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className="mt-6 max-w-3xl leading-7 text-slate-600 dark:text-slate-400">
                                {item.description}
                              </p>
                            )}
                          </article>
                        </RevealItem>
                      );
                    })}
                  </RevealGroup>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProfessionalJourney;
