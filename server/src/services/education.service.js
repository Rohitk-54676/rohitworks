import pool from "../db/pool.js";

const getEducation = async () => {
  const query = `
    SELECT
      id,
      institution,
      degree,
      field,
      TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
      TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
      description,
      display_order,
      created_at,
      updated_at
    FROM education
    ORDER BY
      display_order ASC,
      start_date DESC NULLS LAST,
      created_at DESC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};

const getEducationById = async (id, client = pool) => {
  const query = `
    SELECT
      id,
      institution,
      degree,
      field,
      TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
      TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
      description,
      display_order,
      created_at,
      updated_at
    FROM education
    WHERE id = $1;
  `;

  const { rows } = await client.query(query, [id]);

  return rows[0] || null;
};

const createEducation = async (data) => {
  const {
    institution,
    degree,
    field = null,
    start_date = null,
    end_date = null,
    description = null,
    display_order = 0,
  } = data;

  const query = `
    INSERT INTO education (
      institution,
      degree,
      field,
      start_date,
      end_date,
      description,
      display_order
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
  `;

  const values = [
    institution,
    degree,
    field,
    start_date,
    end_date,
    description,
    display_order,
  ];

  const { rows } = await pool.query(query, values);

  return getEducationById(rows[0].id);
};

const updateEducation = async (id, data) => {
  const allowedFields = [
    "institution",
    "degree",
    "field",
    "start_date",
    "end_date",
    "description",
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
    UPDATE education
    SET
      ${fields.join(", ")},
      updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING id;
  `;

  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    return null;
  }

  return getEducationById(rows[0].id);
};

const deleteEducation = async (id) => {
  const query = `
    DELETE FROM education
    WHERE id = $1
    RETURNING id;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0] || null;
};

export default {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
};