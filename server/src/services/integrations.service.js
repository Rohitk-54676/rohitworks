import githubService from "./github.service.js";
import leetcodeService from "./leetcode.service.js";
import integrationsCacheService from "./integrations-cache.service.js";

const getIntegrations = async () => {
  /*
   * Return cached data when it is still valid.
   */
  const cachedData =
    integrationsCacheService.getCachedIntegrations();

  if (cachedData) {
    return cachedData;
  }

  /*
   * Fetch fresh data from GitHub and LeetCode.
   */
  const [
    githubProfile,
    githubRepositories,
    githubContributions,
    leetcodeProfile,
    leetcodeProblemStats,
    leetcodeActivity,
    leetcodeLanguages,
  ] = await Promise.all([
    githubService.getProfile(),
    githubService.getRepositories(),
    githubService.getContributions(),

    leetcodeService.getProfile(),
    leetcodeService.getProblemStats(),
    leetcodeService.getCalendar(
      new Date().getFullYear()
    ),
    leetcodeService.getLanguageStats(),
  ]);

  /*
   * Normalize the external integration data.
   */
  const integrations = {
    github: {
      profile: githubProfile,
      repositories: githubRepositories,
      contributions: githubContributions,
    },

    leetcode: {
      profile: leetcodeProfile,
      problem_stats: leetcodeProblemStats,
      activity: leetcodeActivity,
      languages: leetcodeLanguages,
    },
  };

  /*
   * Store fresh data in cache.
   */
  integrationsCacheService.setCachedIntegrations(
    integrations
  );

  return integrations;
};

export default {
  getIntegrations,
};