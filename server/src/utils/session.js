import crypto from "crypto";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24;

const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashSessionToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

export {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  generateSessionToken,
  hashSessionToken,
};