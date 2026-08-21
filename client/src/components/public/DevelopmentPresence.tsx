import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

import {
  useGithubContributions,
  useGithubProfile,
  useGithubRepositories,
  useLeetCodeActivity,
  useLeetCodeProblemStats,
  useLeetCodeProfile,
} from "../../hooks/useIntegrations";

const DevelopmentPresence = () => {
  const githubProfile = useGithubProfile();
  const githubRepositories = useGithubRepositories();
  const githubContributions = useGithubContributions();

  const leetcodeProfile = useLeetCodeProfile();
  const leetcodeProblems = useLeetCodeProblemStats();
  const leetcodeActivity = useLeetCodeActivity();

  const isLoading =
    githubProfile.isLoading ||
    githubRepositories.isLoading ||
    githubContributions.isLoading ||
    leetcodeProfile.isLoading ||
    leetcodeProblems.isLoading ||
    leetcodeActivity.isLoading;

  const hasGithubData =
    githubProfile.data &&
    !githubProfile.isError;

  const hasLeetCodeData =
    leetcodeProfile.data &&
    leetcodeProblems.data &&
    !leetcodeProfile.isError &&
    !leetcodeProblems.isError;

  if (isLoading) {
    return (
      <section
        id="development"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-10 w-80 animate-pulse rounded bg-slate-200" />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="h-[380px] animate-pulse border border-slate-200 bg-slate-100" />
            <div className="h-[380px] animate-pulse border border-slate-200 bg-slate-100" />
          </div>
        </div>
      </section>
    );
  }

  if (!hasGithubData && !hasLeetCodeData) {
    return null;
  }

  return (
    <section
      id="development"
      className="border-b border-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Development Presence
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Development activity beyond the portfolio.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Live development data from GitHub and problem-solving progress
            from LeetCode.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* GitHub */}
          {hasGithubData && (
            <article className="border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FaGithub
                    size={30}
                    className="text-slate-950"
                  />

                  <div>
                    <p className="font-semibold text-slate-950">
                      GitHub
                    </p>

                    <p className="text-sm text-slate-500">
                      @{githubProfile.data.username}
                    </p>
                  </div>
                </div>

                <a
                  href={githubProfile.data.profile_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open GitHub profile"
                  className="text-slate-500 transition-colors hover:text-slate-950"
                >
                  <ExternalLink size={19} />
                </a>
              </div>

              {githubProfile.data.bio && (
                <p className="mt-6 leading-7 text-slate-600">
                  {githubProfile.data.bio}
                </p>
              )}

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="border border-slate-200 p-4">
                  <p className="text-2xl font-semibold text-slate-950">
                    {githubProfile.data.public_repositories}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    Repositories
                  </p>
                </div>

                <div className="border border-slate-200 p-4">
                  <p className="text-2xl font-semibold text-slate-950">
                    {githubProfile.data.followers}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    Followers
                  </p>
                </div>

                <div className="border border-slate-200 p-4">
                  <p className="text-2xl font-semibold text-slate-950">
                    {githubContributions.data?.total_contributions ?? 0}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    Contributions
                  </p>
                </div>
              </div>

              {githubRepositories.data && (
                <p className="mt-6 text-sm text-slate-500">
                  {githubRepositories.data.length} repositories returned
                  by the portfolio integration.
                </p>
              )}
            </article>
          )}

          {/* LeetCode */}
          {hasLeetCodeData && (
            <article className="border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <SiLeetcode
                    size={30}
                    className="text-slate-950"
                  />

                  <div>
                    <p className="font-semibold text-slate-950">
                      LeetCode
                    </p>

                    <p className="text-sm text-slate-500">
                      @{leetcodeProfile.data.username}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://leetcode.com/${leetcodeProfile.data.username}/`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open LeetCode profile"
                  className="text-slate-500 transition-colors hover:text-slate-950"
                >
                  <ExternalLink size={19} />
                </a>
              </div>

              {leetcodeProfile.data.real_name && (
                <p className="mt-6 leading-7 text-slate-600">
                  {leetcodeProfile.data.real_name}
                  {leetcodeProfile.data.country &&
                    ` · ${leetcodeProfile.data.country}`}
                </p>
              )}

              <div className="mt-8">
                <p className="text-4xl font-semibold tracking-tight text-slate-950">
                  {leetcodeProblems.data.total}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Problems solved
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="border border-slate-200 p-3">
                  <p className="text-lg font-semibold text-slate-950">
                    {leetcodeProblems.data.easy}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    Easy
                  </p>
                </div>

                <div className="border border-slate-200 p-3">
                  <p className="text-lg font-semibold text-slate-950">
                    {leetcodeProblems.data.medium}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    Medium
                  </p>
                </div>

                <div className="border border-slate-200 p-3">
                  <p className="text-lg font-semibold text-slate-950">
                    {leetcodeProblems.data.hard}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    Hard
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-semibold text-slate-950">
                    {leetcodeProfile.data.ranking ?? "—"}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    Ranking
                  </p>
                </div>

                <div>
                  <p className="text-xl font-semibold text-slate-950">
                    {leetcodeActivity.data?.current_streak ?? 0}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    Current streak
                  </p>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};

export default DevelopmentPresence;