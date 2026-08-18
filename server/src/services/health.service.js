import pool from "../db/pool.js";

const checkDatabase = async () => {
  await pool.query("SELECT 1");

  return {
    status: "connected",
  };
};

export default {
  checkDatabase,
};