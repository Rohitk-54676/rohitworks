import env from "../config/env.js";

const GITHUB_API_BASE_URL = "https://api.github.com";

const githubRequest = async (endpoint) => {
  const response = await fetch(
    `${GITHUB_API_BASE_URL}${endpoint}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${env.github.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Rohit-Portfolio",
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    const error = new Error(
      `GitHub API request failed: ${response.status}`
    );

    error.statusCode =
      response.status === 404
        ? 404
        : response.status === 429
          ? 503
          : 502;

    error.details = errorBody;

    throw error;
  }

  return response.json();
};

const githubGraphqlRequest = async (
  query,
  variables = {}
) => {
  const response = await fetch(
    "https://api.github.com/graphql",
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${env.github.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Rohit-Portfolio",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    const error = new Error(
      `GitHub GraphQL request failed: ${response.status}`
    );

    error.statusCode =
      response.status === 429 ? 503 : 502;

    error.details = errorBody;

    throw error;
  }

  const result = await response.json();

  if (result.errors?.length > 0) {
    const error = new Error(
      "GitHub GraphQL request returned errors"
    );

    error.statusCode = 502;
    error.details = result.errors;

    throw error;
  }

  return result.data;
};

const getProfile = async () => {
  const profile = await githubRequest(
    `/users/${env.github.username}`
  );

  return {
    username: profile.login,
    name: profile.name,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    profile_url: profile.html_url,
    public_repositories: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
  };
};

const getRepositories = async () => {
  const repositories = await githubRequest(
    `/users/${env.github.username}/repos?per_page=100&sort=updated`
  );

  return repositories.map((repository) => ({
    id: repository.id,
    name: repository.name,
    full_name: repository.full_name,
    description: repository.description,
    html_url: repository.html_url,
    homepage: repository.homepage,
    language: repository.language,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    is_fork: repository.fork,
    is_archived: repository.archived,
    created_at: repository.created_at,
    updated_at: repository.updated_at,
    pushed_at: repository.pushed_at,
  }));
};

const getContributions = async () => {
  const query = `
    query GetContributions($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const data = await githubGraphqlRequest(query, {
    username: env.github.username,
  });

  if (!data.user) {
    const error = new Error(
      "GitHub user not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const calendar =
    data.user.contributionsCollection
      .contributionCalendar;

  const days = calendar.weeks.flatMap(
    (week) => week.contributionDays
  );

  return {
    total_contributions: calendar.totalContributions,

    daily_activity: days.map((day) => ({
      date: day.date,
      count: day.contributionCount,
    })),
  };
};

const getGithubData = async () => {
  const [profile, repositories, contributions] =
    await Promise.all([
      getProfile(),
      getRepositories(),
      getContributions(),
    ]);

  return {
    profile,
    repositories,
    contributions,
  };
};



export default {
  getProfile,
  getRepositories,
  getContributions,
  getGithubData,
};