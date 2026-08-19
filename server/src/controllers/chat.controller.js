import aiContextService from "../services/ai-context.service.js";
import aiService from "../services/ai.service.js";

const chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    const context = await aiContextService.buildPortfolioContext({
      message,
    });

    const answer = await aiService.askAI({
      message,
      context,
    });

    return res.status(200).json({
      success: true,
      data: {
        message: answer,
      },
    });
  } catch (error) {
    console.error("Chat controller error:", {
      message: error.message,
      status: error.status,
    });

    return next(error);
  }
};

const chatAboutProject = async (req, res, next) => {
  try {
    const { projectSlug } = req.params;
    const { message } = req.body;

    if (!projectSlug) {
      return res.status(400).json({
        success: false,
        message: "Project slug is required.",
      });
    }

    const context = await aiContextService.buildProjectContext({
      projectSlug,
    });

    const answer = await aiService.askAI({
      message,
      context,
    });

    return res.status(200).json({
      success: true,
      data: {
        message: answer,
      },
    });
  } catch (error) {
    console.error("Project chat controller error:", {
      message: error.message,
      status: error.status,
    });

    return next(error);
  }
};


export default {
  chat,
  chatAboutProject,
};