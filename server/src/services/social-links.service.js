import pool from "../db/pool.js";

const getSocialLinks = async ({ includeInactive = false } = {}) => {
  const values = [];

  let whereClause = "";

  if (!includeInactive) {
    values.push(true);
    whereClause = "WHERE is_active = $1";
  }

  const query = `
    SELECT
      id,
      platform,
      url,
      display_order,
      is_active,
      created_at,
      updated_at
    FROM social_links
    ${whereClause}
    ORDER BY
      display_order ASC,
      created_at ASC;
  `;

  const { rows } = await pool.query(query, values);

  return rows;
};

const createSocialLink = async (data) => {
  const {
    platform,
    url,
    display_order = 0,
    is_active = true,
  } = data;

  const query = `
    INSERT INTO social_links (
      platform,
      url,
      display_order,
      is_active
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    platform,
    url,
    display_order,
    is_active,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

const updateSocialLink = async (id, data) => {
  const allowedFields = [
    "platform",
    "url",
    "display_order",
    "is_active",
  ];

  const fields = [];
  const values = [];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      values.push(data[field]);
      fields.push(`${field} = $${values.length}`);
    }
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const query = `
    UPDATE social_links
    SET
      ${fields.join(", ")},
      updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
};

const deleteSocialLink = async (id) => {
  const query = `
    DELETE FROM social_links
    WHERE id = $1
    RETURNING id;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0] || null;
};

export default {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
};