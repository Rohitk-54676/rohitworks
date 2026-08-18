import siteSettingsService from "../services/site-settings.service.js";
import {
  validateSiteSettings,
} from "../validators/site-settings.validator.js";

const getSiteSettings = async (req, res, next) => {
  try {
    const settings = await siteSettingsService.getSiteSettings();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Site settings not configured",
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

const updateSiteSettings = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    const { isValid, errors } = validateSiteSettings(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const settings =
      await siteSettingsService.updateSiteSettings(req.body);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Site settings not configured",
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSiteSettings,
  updateSiteSettings,
};