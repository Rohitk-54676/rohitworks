import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";

import {
  useGithubContributions,
  useGithubProfile,
  useGithubRepositories,
  useLeetCodeActivity,
  useLeetCodeProblemStats,
  useLeetCodeProfile,
} from "../../hooks/useIntegrations";
import ActivityCalendar from "../common/ActivityCalendar";
import { Reveal } from "../../lib/motion";

type Platform = "github" | "leetcode";

const DevelopmentPresence = () => {
  const [activePlatform, setActivePlatform] = useState<Platform>("github");

  const githubProfile = useGithubProfile();
  const githubRepositories = useGithubRepositories();
  const githubContributions = useGithubContributions();

  const leetcodeProfile = useLeetCodeProfile();
  const leetcodeProblems = useLeetCodeProblemStats();
  const leetcodeActivity = useLeetCodeActivity();

  const hasGithubData = githubProfile.data && !githubProfile.isError;

  const hasLeetCodeData =
    leetcodeProfile.data &&
    leetcodeProblems.data &&
    !leetcodeProfile.isError &&
    !leetcodeProblems.isError;

  const githubLoading =
    githubProfile.isLoading ||
    githubRepositories.isLoading ||
    githubContributions.isLoading;

  const leetcodeLoading =
    leetcodeProfile.isLoading ||
    leetcodeProblems.isLoading ||
    leetcodeActivity.isLoading;

  if (!githubLoading && !leetcodeLoading && !hasGithubData && !hasLeetCodeData) {
    return null;
  }

  const activeGithub = activePlatform === "github";
  const activePlatformLoading = activeGithub ? githubLoading : leetcodeLoading;

  return (
    <section id="development" className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Development Presence
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Development activity beyond the portfolio.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
            Live development data from GitHub and problem-solving progress
            from LeetCode.
          </p>
        </Reveal>

        {/* Platform Toggle */}
        <div className="mt-10 inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {(
            [
              { key: "github" as const, label: "GitHub", Icon: FaGithub, enabled: hasGithubData || githubLoading },
              { key: "leetcode" as const, label: "LeetCode", Icon: SiLeetcode, enabled: hasLeetCodeData || leetcodeLoading },
            ] as const
          ).map(({ key, label, Icon, enabled }) => {
            const isActive = activePlatform === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActivePlatform(key)}
                disabled={!enabled}
                className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  !enabled ? "cursor-not-allowed opacity-40" : ""
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="dev-presence-pill"
                    className="absolute inset-0 rounded-full bg-slate-950 dark:bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-2 ${
                    isActive
                      ? "text-white dark:text-slate-950"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <Icon size={17} />
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {activePlatformLoading && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800" />
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* GitHub Panel */}
          {!activePlatformLoading && activeGithub && hasGithubData && (
            <motion.article
              key="github"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FaGithub size={30} className="text-slate-950 dark:text-white" />
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">GitHub</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      @{githubProfile.data!.username}
                    </p>
                  </div>
                </div>

                <a
                  href={githubProfile.data!.profile_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open GitHub profile"
                  className="text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                >
                  <ExternalLink size={19} />
                </a>
              </div>

              {githubProfile.data!.bio && (
                <p className="mt-6 max-w-3xl leading-7 text-slate-600 dark:text-slate-400">
                  {githubProfile.data!.bio}
                </p>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                  <p className="text-3xl font-semibold text-slate-950 dark:text-white">
                    {githubProfile.data!.public_repositories}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Repositories
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                  <p className="text-3xl font-semibold text-slate-950 dark:text-white">
                    {githubProfile.data!.followers}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Followers
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                  <p className="text-3xl font-semibold text-slate-950 dark:text-white">
                    {githubContributions.data?.total_contributions ?? 0}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Contributions
                  </p>
                </div>
              </div>

              {githubContributions.data && (
                <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
                  <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Contribution activity
                  </p>
                  <ActivityCalendar data={githubContributions.data.daily_activity} />
                </div>
              )}

              {githubRepositories.data && (
                <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {githubRepositories.data.length} repositories available
                    through the portfolio integration.
                  </p>
                </div>
              )}
            </motion.article>
          )}

          {/* LeetCode Panel */}
          {!activePlatformLoading && !activeGithub && hasLeetCodeData && (
            <motion.article
              key="leetcode"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <SiLeetcode size={30} className="text-slate-950 dark:text-white" />
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">LeetCode</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      @{leetcodeProfile.data!.username}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://leetcode.com/${leetcodeProfile.data!.username}/`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open LeetCode profile"
                  className="text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                >
                  <ExternalLink size={19} />
                </a>
              </div>

              {leetcodeProfile.data!.real_name && (
                <p className="mt-6 leading-7 text-slate-600 dark:text-slate-400">
                  {leetcodeProfile.data!.real_name}
                  {leetcodeProfile.data!.country && ` · ${leetcodeProfile.data!.country}`}
                </p>
              )}

              <div className="mt-10">
                <p className="text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {leetcodeProblems.data!.total}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Problems solved
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                  <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                    {leetcodeProblems.data!.easy}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Easy
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                  <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">
                    {leetcodeProblems.data!.medium}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Medium
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                  <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                    {leetcodeProblems.data!.hard}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Hard
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 border-t border-slate-200 pt-6 dark:border-slate-800 sm:grid-cols-2">
                <div>
                  <p className="text-2xl font-semibold text-slate-950 dark:text-white">
                    {leetcodeProfile.data!.ranking ?? "—"}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Ranking
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold text-slate-950 dark:text-white">
                    {leetcodeActivity.data?.current_streak ?? 0}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Current Streak
                  </p>
                </div>
              </div>

              {leetcodeActivity.data && (
                <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
                  <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Submission activity
                  </p>
                  <ActivityCalendar data={leetcodeActivity.data.daily_activity} />
                </div>
              )}
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DevelopmentPresence;
