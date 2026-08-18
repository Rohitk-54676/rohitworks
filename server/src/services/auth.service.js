import bcrypt from "bcrypt";
import crypto from "crypto";

import env from "../config/env.js";
import pool from "../db/pool.js";

import {
  SESSION_DURATION_MS,
  generateSessionToken,
  hashSessionToken,
} from "../utils/session.js";

const authenticateAdmin = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== env.adminEmail.toLowerCase()) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    env.adminPasswordHash
  );

  if (!passwordMatches) {
    return null;
  }

  const sessionToken = generateSessionToken();
  const sessionTokenHash = hashSessionToken(sessionToken);

  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await pool.query(
    `
      INSERT INTO admin_sessions (
        session_token_hash,
        expires_at
      )
      VALUES ($1, $2)
    `,
    [sessionTokenHash, expiresAt]
  );

  return {
    sessionToken,
    expiresAt,
  };
};

const getSession = async (sessionToken) => {
  if (!sessionToken) {
    return null;
  }

  const sessionTokenHash = hashSessionToken(sessionToken);

  const result = await pool.query(
    `
      SELECT id, expires_at
      FROM admin_sessions
      WHERE session_token_hash = $1
        AND expires_at > NOW()
      LIMIT 1
    `,
    [sessionTokenHash]
  );

  return result.rows[0] || null;
};

const deleteSession = async (sessionToken) => {
  if (!sessionToken) {
    return;
  }

  const sessionTokenHash = hashSessionToken(sessionToken);

  await pool.query(
    `
      DELETE FROM admin_sessions
      WHERE session_token_hash = $1
    `,
    [sessionTokenHash]
  );
};

const cleanupExpiredSessions = async () => {
  await pool.query(
    `
      DELETE FROM admin_sessions
      WHERE expires_at <= NOW()
    `
  );
};

export default {
  authenticateAdmin,
  getSession,
  deleteSession,
  cleanupExpiredSessions,
};