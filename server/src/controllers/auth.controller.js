import authService from "../services/auth.service.js";
import { SESSION_COOKIE_NAME } from "../utils/session.js";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24,
    path: "/",
  };
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const session = await authService.authenticateAdmin(email, password);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.cookie(
      SESSION_COOKIE_NAME,
      session.sessionToken,
      getCookieOptions()
    );

    return res.status(200).json({
      success: true,
      data: {
        message: "Login successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        authenticated: true,
        admin: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const sessionToken = req.cookies[SESSION_COOKIE_NAME];

    if (sessionToken) {
      await authService.deleteSession(sessionToken);
    }

    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      data: {
        message: "Logout successful",
      },
    });
  } catch (error) {
    next(error);
  }
};


export default {
  login,
  getMe,
  logout,
};