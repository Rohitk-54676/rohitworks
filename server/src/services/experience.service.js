import pool from "../db/pool.js";

const getExperience = async () => {
  const query = `
    SELECT
      id,
      organization,
      role,
      location,
      description,
      start_date,
      end_date,
      is_current,
      achievements,
      display_order,
      created_at,
      updated_at
    FROM experience
    ORDER BY
      is_current DESC,
      display_order ASC,
      start_date DESC,
      created_at DESC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};



const createExperience = async (data) => {
  const {
    organization,
    role,
    location = null,
    description = null,
    start_date,
    end_date = null,
    is_current = false,
    achievements = null,
    display_order = 0,
  } = data;

  const query = `
    INSERT INTO experience (
      organization,
      role,
      location,
      description,
      start_date,
      end_date,
      is_current,
      achievements,
      display_order
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9
    )
    RETURNING *;
  `;

  const values = [
    organization,
    role,
    location,
    description,
    start_date,
    end_date,
    is_current,
    achievements,
    display_order,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};


const updateExperience = async (id, data) => {
  const allowedFields = [
    "organization",
    "role",
    "location",
    "description",
    "start_date",
    "end_date",
    "is_current",
    "achievements",
    "display_order",
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
    UPDATE experience
    SET
      ${fields.join(", ")},
      updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
};



const deleteExperience = async (id) => {
  const query = `
    DELETE FROM experience
    WHERE id = $1
    RETURNING id;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0] || null;
};

export default {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
};