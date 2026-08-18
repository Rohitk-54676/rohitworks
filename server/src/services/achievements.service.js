import pool from "../db/pool.js";
import cloudinaryService from "./cloudinary.service.js";

const getAchievements = async () => {
  const query = `
    SELECT
      id,
      title,
      description,
      organization,
      achievement_date,
      proof_url,
      media_url,
      media_public_id,
      display_order,
      created_at,
      updated_at
    FROM achievements
    ORDER BY
      display_order ASC,
      achievement_date DESC NULLS LAST,
      created_at DESC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};



const createAchievement = async (data) => {
  const {
    title,
    description = null,
    organization = null,
    achievement_date = null,
    proof_url = null,
    media_url = null,
    media_public_id = null,
    display_order = 0,
  } = data;

  const query = `
    INSERT INTO achievements (
      title,
      description,
      organization,
      achievement_date,
      proof_url,
      media_url,
      media_public_id,
      display_order
    )
    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8
    )
    RETURNING *;
  `;

  const values = [
    title,
    description,
    organization,
    achievement_date,
    proof_url,
    media_url,
    media_public_id,
    display_order,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};


const updateAchievement = async (id, data) => {
  const allowedFields = [
    "title",
    "description",
    "organization",
    "achievement_date",
    "proof_url",
    "media_url",
    "media_public_id",
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
    UPDATE achievements
    SET
      ${fields.join(", ")},
      updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
};


const deleteAchievement = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /*
     * Get the achievement's Cloudinary reference
     * before deleting the database record.
     */
    const achievementResult = await client.query(
      `
        SELECT
          id,
          media_public_id
        FROM achievements
        WHERE id = $1;
      `,
      [id]
    );

    if (achievementResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const achievement = achievementResult.rows[0];

    /*
     * Delete the PostgreSQL record first.
     */
    const deleteResult = await client.query(
      `
        DELETE FROM achievements
        WHERE id = $1
        RETURNING id;
      `,
      [id]
    );

    if (deleteResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query("COMMIT");

    /*
     * PostgreSQL deletion succeeded.
     *
     * Cloudinary cleanup happens after COMMIT because
     * Cloudinary cannot participate in the PostgreSQL transaction.
     */
    let cloudinaryCleanupFailed = false;

    if (achievement.media_public_id) {
      try {
        await cloudinaryService.deleteAsset(
          achievement.media_public_id,
          {
            resourceType: "image",
          }
        );
      } catch (error) {
        cloudinaryCleanupFailed = true;

        console.error(
          "Achievement deleted but Cloudinary media cleanup failed:",
          {
            achievementId: id,
            cloudinaryPublicId:
              achievement.media_public_id,
            error,
          }
        );
      }
    }

    return {
      id: deleteResult.rows[0].id,
      cloudinary_cleanup_failed:
        cloudinaryCleanupFailed,
    };
  } catch (error) {
    /*
     * PostgreSQL failed.
     *
     * Roll back the transaction.
     * Cloudinary has not been touched.
     */
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};



export default {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};