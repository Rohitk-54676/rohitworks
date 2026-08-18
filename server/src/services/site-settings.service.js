import pool from "../db/pool.js";

const getSiteSettings = async () => {
  const query = `
    SELECT
      id,
      name,
      headline,
      bio,
      email,
      location,
      availability_status,
      profile_image_url,
      profile_image_public_id,
      resume_url,
      resume_public_id,
      current_focus,
      updated_at
    FROM site_settings
    WHERE id = 1;
  `;

  const { rows } = await pool.query(query);

  return rows[0] || null;
};

const updateSiteSettings = async (data) => {
  const allowedFields = [
    "name",
    "headline",
    "bio",
    "email",
    "location",
    "availability_status",
    "profile_image_url",
    "profile_image_public_id",
    "resume_url",
    "resume_public_id",
    "current_focus",
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

  values.push(1);

  const query = `
    UPDATE site_settings
    SET
      ${fields.join(", ")},
      updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING
      id,
      name,
      headline,
      bio,
      email,
      location,
      availability_status,
      profile_image_url,
      profile_image_public_id,
      resume_url,
      resume_public_id,
      current_focus,
      updated_at;
  `;

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
};

export default {
  getSiteSettings,
  updateSiteSettings,
};