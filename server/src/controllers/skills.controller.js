import skillsService from "../services/skills.service.js";
import {
  validateSkill,
  validateSkillId,
} from "../validators/skill.validator.js";

const getSkills = async (req, res, next) => {
  try {
    const skills = await skillsService.getSkills();

    return res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const { isValid, errors } = validateSkill(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const skill = await skillsService.createSkill(req.body);

    return res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    if (!validateSkillId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    const { isValid, errors } = validateSkill(req.body, {
      partial: true,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const skill = await skillsService.updateSkill(
      req.params.id,
      req.body
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    if (!validateSkillId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    const deletedSkill = await skillsService.deleteSkill(
      req.params.id
    );

    if (!deletedSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedSkill,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};