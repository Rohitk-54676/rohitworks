import authService from "../services/auth.service.js";
import { SESSION_COOKIE_NAME } from "../utils/session.js";

const requireAdmin = async (req, res, next) => {
  try {
    const sessionToken = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const session = await authService.getSession(sessionToken);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    req.admin = {
      authenticated: true,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default requireAdmin;