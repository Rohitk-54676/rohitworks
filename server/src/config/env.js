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
};

export default env;