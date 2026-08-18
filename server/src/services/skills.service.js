import pool from "../db/pool.js";

const getSkills = async () => {
  const query = `
    SELECT
      id,
      name,
      category,
      icon_reference,
      display_order,
      created_at,
      updated_at
    FROM skills
    ORDER BY
      category ASC,
      display_order ASC,
      name ASC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};



const createSkill = async (data) => {
  const {
    name,
    category,
    icon_reference = null,
    display_order = 0,
  } = data;

  const query = `
    INSERT INTO skills (
      name,
      category,
      icon_reference,
      display_order
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    name,
    category,
    icon_reference,
    display_order,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};


const updateSkill = async (id, data) => {
  const allowedFields = [
    "name",
    "category",
    "icon_reference",
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
    UPDATE skills
    SET
      ${fields.join(", ")},
      updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
};



const deleteSkill = async (id) => {
  const query = `
    DELETE FROM skills
    WHERE id = $1
    RETURNING id;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0] || null;
};



export default {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};