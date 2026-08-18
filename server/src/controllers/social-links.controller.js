import socialLinksService from "../services/social-links.service.js";
import {
  validateSocialLink,
  validateSocialLinkId,
} from "../validators/social-link.validator.js";

const getSocialLinks = async (req, res, next) => {
  try {
    const includeInactive =
      req.query.includeInactive === "true";

    const socialLinks = await socialLinksService.getSocialLinks({
      includeInactive,
    });

    return res.status(200).json({
      success: true,
      data: socialLinks,
    });
  } catch (error) {
    next(error);
  }
};

const createSocialLink = async (req, res, next) => {
  try {
    const { isValid, errors } = validateSocialLink(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const socialLink =
      await socialLinksService.createSocialLink(req.body);

    return res.status(201).json({
      success: true,
      data: socialLink,
    });
  } catch (error) {
    next(error);
  }
};

const updateSocialLink = async (req, res, next) => {
  try {
    if (!validateSocialLinkId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid social link ID",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    const { isValid, errors } = validateSocialLink(req.body, {
      partial: true,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const socialLink =
      await socialLinksService.updateSocialLink(
        req.params.id,
        req.body
      );

    if (!socialLink) {
      return res.status(404).json({
        success: false,
        message: "Social link not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: socialLink,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSocialLink = async (req, res, next) => {
  try {
    if (!validateSocialLinkId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid social link ID",
      });
    }

    const deletedSocialLink =
      await socialLinksService.deleteSocialLink(req.params.id);

    if (!deletedSocialLink) {
      return res.status(404).json({
        success: false,
        message: "Social link not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedSocialLink,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
};