import projectsService from "../services/projects.service.js";
import {
  validateProject,
  validateProjectId,
} from "../validators/project.validator.js";

const getProjects = async (req, res, next) => {
  try {
    const { featured, status } = req.query;

    let featuredValue;

    if (featured !== undefined) {
      if (featured !== "true" && featured !== "false") {
        return res.status(400).json({
          success: false,
          message: "featured must be true or false",
        });
      }

      featuredValue = featured === "true";
    }

    const projects = await projectsService.getProjects({
      featured: featuredValue,
      status,
    });

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const project = await projectsService.getProjectBySlug(slug);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { isValid, errors } = validateProject(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const project = await projectsService.createProject(req.body);

    return res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    if (!validateProjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    const { isValid, errors } = validateProject(req.body, {
      partial: true,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const project = await projectsService.updateProject(
      req.params.id,
      req.body
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    if (!validateProjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const deletedProject = await projectsService.deleteProject(
      req.params.id
    );

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedProject,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};