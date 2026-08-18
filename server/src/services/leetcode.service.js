import env from "../config/env.js";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const leetcodeRequest = async (
  query,
  variables = {},
  operationName
) => {
  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com/",
      "User-Agent": "Rohit-Portfolio",
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    const error = new Error(
      `LeetCode GraphQL request failed: ${response.status}`
    );

    error.statusCode = 502;
    error.details = errorBody;

    throw error;
  }

  const result = await response.json();

  if (result.errors?.length > 0) {
    const error = new Error(
      "LeetCode GraphQL request returned errors"
    );

    error.statusCode = 502;
    error.details = result.errors;

    throw error;
  }

  return result.data;
};

const getProfile = async () => {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          userAvatar
          realName
          aboutMe
          countryName
        }
      }
    }
  `;

  const data = await leetcodeRequest(
    query,
    {
      username: env.leetcode.username,
    },
    "userPublicProfile"
  );

  if (!data.matchedUser) {
    const error = new Error(
      "LeetCode user not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const user = data.matchedUser;

  return {
    username: user.username,
    ranking: user.profile?.ranking ?? null,
    avatar_url: user.profile?.userAvatar ?? null,
    real_name: user.profile?.realName ?? null,
    about: user.profile?.aboutMe ?? null,
    country: user.profile?.countryName ?? null,
  };
};

const getProblemStats = async () => {
  const query = `
    query userProblemsSolved($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }

      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const data = await leetcodeRequest(
    query,
    {
      username: env.leetcode.username,
    },
    "userProblemsSolved"
  );

  if (!data.matchedUser) {
    const error = new Error(
      "LeetCode user not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const solved =
    data.matchedUser.submitStatsGlobal
      ?.acSubmissionNum ?? [];

  const getCount = (difficulty) => {
    const item = solved.find(
      (entry) => entry.difficulty === difficulty
    );

    return item?.count ?? 0;
  };

  return {
    total: getCount("All"),
    easy: getCount("Easy"),
    medium: getCount("Medium"),
    hard: getCount("Hard"),
  };
};

const getCalendar = async (year) => {
  const query = `
    query userProfileCalendar(
      $username: String!,
      $year: Int
    ) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          activeYears
          streak
          totalActiveDays
          submissionCalendar
          dccBadges {
            timestamp
            badge {
              name
              icon
            }
          }
        }
      }
    }
  `;

  const data = await leetcodeRequest(
    query,
    {
      username: env.leetcode.username,
      year,
    },
    "userProfileCalendar"
  );

  if (!data.matchedUser) {
    const error = new Error(
      "LeetCode user not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const calendar =
    data.matchedUser.userCalendar;

  if (!calendar) {
    const error = new Error(
      "LeetCode calendar data is unavailable"
    );

    error.statusCode = 502;

    throw error;
  }

  let submissionCalendar = {};

  if (calendar.submissionCalendar) {
    try {
      submissionCalendar = JSON.parse(
        calendar.submissionCalendar
      );
    } catch {
      throw new Error(
        "Invalid LeetCode submission calendar data"
      );
    }
  }

  const dailyActivity = Object.entries(
    submissionCalendar
  )
    .map(([timestamp, count]) => ({
      date: new Date(Number(timestamp) * 1000)
        .toISOString()
        .slice(0, 10),
      count: Number(count),
    }))
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    );

  return {
    active_years: calendar.activeYears ?? [],
    current_streak: calendar.streak ?? 0,
    total_active_days:
      calendar.totalActiveDays ?? 0,
    daily_activity: dailyActivity,
    daily_challenge_badges:
      calendar.dccBadges ?? [],
  };
};

const getLanguageStats = async () => {
  const query = `
    query languageStats($username: String!) {
      matchedUser(username: $username) {
        languageProblemCount {
          languageName
          problemsSolved
        }
      }
    }
  `;

  const data = await leetcodeRequest(
    query,
    {
      username: env.leetcode.username,
    },
    "languageStats"
  );

  if (!data.matchedUser) {
    const error = new Error(
      "LeetCode user not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return (
    data.matchedUser.languageProblemCount ?? []
  ).map((language) => ({
    language: language.languageName,
    problems_solved: language.problemsSolved,
  }));
};

const getLeetCodeData = async () => {
  const currentYear = new Date().getFullYear();

  const [
    profile,
    problemStats,
    calendar,
    languageStats,
  ] = await Promise.all([
    getProfile(),
    getProblemStats(),
    getCalendar(currentYear),
    getLanguageStats(),
  ]);

  return {
    profile,
    problem_stats: problemStats,
    activity: calendar,
    languages: languageStats,
  };
};




export default {
  getProfile,
  getProblemStats,
  getCalendar,
  getLanguageStats,
  getLeetCodeData,
};