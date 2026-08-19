import projectsService from "./projects.service.js";
import skillsService from "./skills.service.js";
import experienceService from "./experience.service.js";
import educationService from "./education.service.js";
import achievementsService from "./achievements.service.js";
import certificationsService from "./certifications.service.js";
import siteSettingsService from "./site-settings.service.js";
import socialLinksService from "./social-links.service.js";
import integrationsService from "./integrations.service.js";

const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).toLowerCase();
};

const includesAny = (text, keywords) => {
  const normalizedText = normalizeText(text);

  return keywords.some((keyword) =>
    normalizedText.includes(keyword.toLowerCase())
  );
};

const getQuestionCategories = (message) => {
  const categories = new Set();

  if (
    includesAny(message, [
      "project",
      "projects",
      "built",
      "build",
      "portfolio",
      "unicsync",
    ])
  ) {
    categories.add("projects");
  }

  if (
    includesAny(message, [
      "skill",
      "skills",
      "technology",
      "technologies",
      "tech stack",
      "know",
      "language",
    ])
  ) {
    categories.add("skills");
  }

  if (
    includesAny(message, [
      "experience",
      "work",
      "worked",
      "job",
      "internship",
      "intern",
    ])
  ) {
    categories.add("experience");
  }

  if (
    includesAny(message, [
      "education",
      "degree",
      "university",
      "college",
      "study",
      "studied",
    ])
  ) {
    categories.add("education");
  }

  if (
    includesAny(message, [
      "achievement",
      "achievements",
      "award",
      "awards",
      "hackathon",
      "competition",
    ])
  ) {
    categories.add("achievements");
  }

  if (
    includesAny(message, [
      "certificate",
      "certification",
      "certifications",
    ])
  ) {
    categories.add("certifications");
  }

  if (
    includesAny(message, [
      "github",
      "repository",
      "repositories",
      "repo",
      "repos",
      "commit",
      "contribution",
      "contributions",
      "coding activity",
    ])
  ) {
    categories.add("github");
  }

  if (
    includesAny(message, [
      "leetcode",
      "problems solved",
      "contest rating",
      "coding problems",
    ])
  ) {
    categories.add("leetcode");
  }

  if (
    includesAny(message, [
      "social",
      "linkedin",
      "github profile",
      "profile link",
    ])
  ) {
    categories.add("socialLinks");
  }

  if (
    includesAny(message, [
      "about",
      "introduction",
      "introduce",
      "background",
      "who is rohit",
      "tell me about rohit",
      "current focus",
      "focus",
    ])
  ) {
    categories.add("siteSettings");
  }

  return categories;
};

const safelyGet = async (loader, label) => {
  try {
    return await loader();
  } catch (error) {
    console.error(`AI context: failed to load ${label}`, {
      message: error.message,
    });

    return null;
  }
};

const getProjectsContext = async () => {
  const projects = await safelyGet(
    () => projectsService.getProjects({ status: "completed" }),
    "projects"
  );

  return projects || [];
};

const getSkillsContext = async () => {
  const skills = await safelyGet(
    () => skillsService.getSkills(),
    "skills"
  );

  return skills || [];
};

const getExperienceContext = async () => {
  const experience = await safelyGet(
    () => experienceService.getExperience(),
    "experience"
  );

  return experience || [];
};

const getEducationContext = async () => {
  const education = await safelyGet(
    () => educationService.getEducation(),
    "education"
  );

  return education || [];
};

const getAchievementsContext = async () => {
  const achievements = await safelyGet(
    () => achievementsService.getAchievements(),
    "achievements"
  );

  return achievements || [];
};

const getCertificationsContext = async () => {
  const certifications = await safelyGet(
    () => certificationsService.getCertifications(),
    "certifications"
  );

  return certifications || [];
};

const getSiteSettingsContext = async () => {
  const siteSettings = await safelyGet(
    () => siteSettingsService.getSiteSettings(),
    "site settings"
  );

  if (!siteSettings) {
    return null;
  }

  /*
   * The AI must never receive private administrative
   * information such as internal media identifiers.
   *
   * Only public profile information is selected.
   */
  return {
    name: siteSettings.name,
    headline: siteSettings.headline,
    bio: siteSettings.bio,
    location: siteSettings.location,
    availability_status: siteSettings.availability_status,
    current_focus: siteSettings.current_focus,
  };
};

const getSocialLinksContext = async () => {
  const socialLinks = await safelyGet(
    () => socialLinksService.getSocialLinks(),
    "social links"
  );

  if (!socialLinks) {
    return [];
  }

  return socialLinks.map((link) => ({
    platform: link.platform,
    url: link.url,
  }));
};

const getIntegrationsContext = async (message) => {
  const needsGithub = includesAny(message, [
    "github",
    "repository",
    "repositories",
    "repo",
    "repos",
    "commit",
    "contribution",
    "contributions",
    "coding activity",
  ]);

  const needsLeetcode = includesAny(message, [
    "leetcode",
    "problems solved",
    "contest rating",
    "coding problems",
  ]);

  if (!needsGithub && !needsLeetcode) {
    return null;
  }

  const integrations = await safelyGet(
    () => integrationsService.getIntegrations(),
    "integrations"
  );

  if (!integrations) {
    return {
      github: null,
      leetcode: null,
    };
  }

  const result = {};

  if (needsGithub) {
    result.github = integrations.github
      ? {
          profile: integrations.github.profile
            ? {
                username: integrations.github.profile.username,
                name: integrations.github.profile.name,
                bio: integrations.github.profile.bio,
                profile_url:
                  integrations.github.profile.profile_url,
                public_repositories:
                  integrations.github.profile.public_repositories,
                followers:
                  integrations.github.profile.followers,
                following:
                  integrations.github.profile.following,
              }
            : null,

          repositories:
            integrations.github.repositories?.map(
              (repository) => ({
                name: repository.name,
                description: repository.description,
                language: repository.language,
                stars: repository.stars,
                forks: repository.forks,
                html_url: repository.html_url,
                is_fork: repository.is_fork,
                is_archived: repository.is_archived,
                created_at: repository.created_at,
                updated_at: repository.updated_at,
              })
            ) || [],

          contributions:
            integrations.github.contributions
              ? {
                  total_contributions:
                    integrations.github.contributions
                      .total_contributions,

                  daily_activity:
                    integrations.github.contributions
                      .daily_activity,
                }
              : null,
        }
      : null;
  }

  if (needsLeetcode) {
    result.leetcode = integrations.leetcode
      ? {
          profile: integrations.leetcode.profile
            ? {
                username:
                  integrations.leetcode.profile.username,
                ranking:
                  integrations.leetcode.profile.ranking,
                real_name:
                  integrations.leetcode.profile.real_name,
                country:
                  integrations.leetcode.profile.country,
              }
            : null,

          problem_stats:
            integrations.leetcode.problem_stats || null,

          activity:
            integrations.leetcode.activity
              ? {
                  active_years:
                    integrations.leetcode.activity
                      .active_years,
                  current_streak:
                    integrations.leetcode.activity
                      .current_streak,
                  total_active_days:
                    integrations.leetcode.activity
                      .total_active_days,
                  daily_activity:
                    integrations.leetcode.activity
                      .daily_activity,
                }
              : null,

          languages:
            integrations.leetcode.languages || null,
        }
      : null;
  }

  return result;
};

const buildPortfolioContext = async ({ message }) => {
  const categories = getQuestionCategories(message);

  /*
   * Broad questions need a small general profile context.
   */
  if (categories.size === 0) {
    categories.add("siteSettings");
    categories.add("projects");
    categories.add("skills");
  }

  const context = {};

  const tasks = [];

  if (categories.has("projects")) {
    tasks.push(
      getProjectsContext().then((data) => {
        context.projects = data;
      })
    );
  }

  if (categories.has("skills")) {
    tasks.push(
      getSkillsContext().then((data) => {
        context.skills = data;
      })
    );
  }

  if (categories.has("experience")) {
    tasks.push(
      getExperienceContext().then((data) => {
        context.experience = data;
      })
    );
  }

  if (categories.has("education")) {
    tasks.push(
      getEducationContext().then((data) => {
        context.education = data;
      })
    );
  }

  if (categories.has("achievements")) {
    tasks.push(
      getAchievementsContext().then((data) => {
        context.achievements = data;
      })
    );
  }

  if (categories.has("certifications")) {
    tasks.push(
      getCertificationsContext().then((data) => {
        context.certifications = data;
      })
    );
  }

  if (categories.has("siteSettings")) {
    tasks.push(
      getSiteSettingsContext().then((data) => {
        context.profile = data;
      })
    );
  }

  if (categories.has("socialLinks")) {
    tasks.push(
      getSocialLinksContext().then((data) => {
        context.social_links = data;
      })
    );
  }

  const integrationContext = await getIntegrationsContext(message);

  if (integrationContext) {
    context.developer_activity = integrationContext;
  }

  await Promise.all(tasks);

  return JSON.stringify(context, null, 2);
};


const buildProjectContext = async ({ projectSlug }) => {
  const project = await safelyGet(
    () => projectsService.getProjectBySlug(projectSlug),
    "project"
  );

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  return JSON.stringify(
    {
      project: {
        title: project.title,
        slug: project.slug,
        description: project.description,
        problem_statement: project.problem_statement,
        solution: project.solution,
        features: project.features,
        challenges: project.challenges,
        technologies: project.technologies,
        github_url: project.github_url,
        live_url: project.live_url,
      },
    },
    null,
    2
  );
};


export default {
  buildPortfolioContext,
  buildProjectContext,
};
