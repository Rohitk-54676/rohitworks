import pool from "../db/pool.js";

const getTechnologies = async () => {
  const query = `
    SELECT
      id,
      name,
      slug,
      created_at
    FROM technologies
    ORDER BY name ASC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};


const createTechnology = async (data) => {
  const {
    name,
    slug,
  } = data;

  const query = `
    INSERT INTO technologies (
      name,
      slug
    )
    VALUES ($1, $2)
    RETURNING *;
  `;

  const values = [
    name,
    slug,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};


const updateTechnology = async (id, data) => {
  const allowedFields = [
    "name",
    "slug",
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
    UPDATE technologies
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
};


const deleteTechnology = async (id) => {
  const query = `
    DELETE FROM technologies
    WHERE id = $1
    RETURNING id;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0] || null;
};


export default {
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
};