import healthService from "../services/health.service.js";

const getHealth = async (req, res, next) => {
  try {
    const database = await healthService.checkDatabase();

    return res.status(200).json({
      success: true,
      data: {
        status: "ok",
        database: database.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getHealth,
};