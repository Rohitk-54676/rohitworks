import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "DATABASE_URL",
  "CLIENT_URL",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD_HASH",
  "SESSION_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "GITHUB_USERNAME",
  "GITHUB_TOKEN",
  "OPENROUTER_API_KEY",
  "OPENROUTER_MODEL",
  "RESEND_API_KEY",
  "NOTIFICATION_EMAIL",
  "EMAIL_FROM",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  clientUrl: process.env.CLIENT_URL,

  databaseUrl: process.env.DATABASE_URL,

  adminEmail: process.env.ADMIN_EMAIL,

  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,

  sessionSecret: process.env.SESSION_SECRET,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  github: {
  username: process.env.GITHUB_USERNAME,
  token: process.env.GITHUB_TOKEN,
  },
  leetcode: {
  username: process.env.LEETCODE_USERNAME,
  },
  openRouter: {
  apiKey: process.env.OPENROUTER_API_KEY,
  model: process.env.OPENROUTER_MODEL,
  },
  email: {
  resendApiKey: process.env.RESEND_API_KEY,
  notificationEmail: process.env.NOTIFICATION_EMAIL,
  from: process.env.EMAIL_FROM,
  },
};

export default env;