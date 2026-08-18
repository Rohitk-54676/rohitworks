import app from "./app.js";
import env from "./config/env.js";
import pool from "./db/pool.js";
import authService from "./services/auth.service.js";

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("Database connected");

    await authService.cleanupExpiredSessions();

    console.log("Expired sessions cleaned up");

    const server = app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await pool.end();

        console.log("Server and database connection closed.");

        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Database connection failed:", error.message);

    await pool.end();

    process.exit(1);
  }
};

startServer();