import pg from "pg";

import env from "../config/env.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.databaseUrl,

  max: 10,

  idleTimeoutMillis: 30_000,

  connectionTimeoutMillis: 10_000,

  keepAlive: true,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export default pool;