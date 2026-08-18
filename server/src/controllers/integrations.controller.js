import githubService from "../services/github.service.js";
import leetcodeService from "../services/leetcode.service.js";
import integrationsService from "../services/integrations.service.js";

const getGithubProfile = async (req, res, next) => {
  try {
    const profile = await githubService.getProfile();

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const getGithubRepositories = async (req, res, next) => {
  try {
    const repositories =
      await githubService.getRepositories();

    return res.status(200).json({
      success: true,
      data: repositories,
    });
  } catch (error) {
    next(error);
  }
};

const getGithubContributions = async (req, res, next) => {
  try {
    const contributions =
      await githubService.getContributions();

    return res.status(200).json({
      success: true,
      data: contributions,
    });
  } catch (error) {
    next(error);
  }
};

const getLeetCodeProfile = async (req, res, next) => {
  try {
    const profile =
      await leetcodeService.getProfile();

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const getLeetCodeProblemStats = async (
  req,
  res,
  next
) => {
  try {
    const stats =
      await leetcodeService.getProblemStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getLeetCodeActivity = async (
  req,
  res,
  next
) => {
  try {
    const currentYear = new Date().getFullYear();

    const activity =
    await leetcodeService.getCalendar(currentYear);

    return res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

const getLeetCodeLanguages = async (
  req,
  res,
  next
) => {
  try {
    const languages =
      await leetcodeService.getLanguageStats();

    return res.status(200).json({
      success: true,
      data: languages,
    });
  } catch (error) {
    next(error);
  }
};


const getIntegrations = async (req, res, next) => {
  try {
    const integrations =
      await integrationsService.getIntegrations();

    return res.status(200).json({
      success: true,
      data: integrations,
    });
  } catch (error) {
    next(error);
  }
};



export default {
  getGithubProfile,
  getGithubRepositories,
  getGithubContributions,
  getLeetCodeProfile,
  getLeetCodeProblemStats,
  getLeetCodeActivity,
  getLeetCodeLanguages,
  getIntegrations,
};