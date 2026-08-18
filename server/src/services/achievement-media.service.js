import pool from "../db/pool.js";
import cloudinaryService from "./cloudinary.service.js";

const uploadAchievementMedia = async ({
  achievementId,
  file,
}) => {
  /*
   * Get the existing achievement and current media reference.
   */
  const achievementResult = await pool.query(
    `
      SELECT
        id,
        media_url,
        media_public_id
      FROM achievements
      WHERE id = $1;
    `,
    [achievementId]
  );

  if (achievementResult.rows.length === 0) {
    return null;
  }

  const achievement = achievementResult.rows[0];

  let newCloudinaryAsset;

  try {
    /*
     * Upload new media first.
     */
    newCloudinaryAsset =
      await cloudinaryService.uploadBuffer(
        file.buffer,
        {
          folder: "portfolio/achievements",
          resourceType: "image",
        }
      );

    /*
     * Update PostgreSQL.
     */
    const updateResult = await pool.query(
      `
        UPDATE achievements
        SET
          media_url = $1,
          media_public_id = $2,
          updated_at = NOW()
        WHERE id = $3
        RETURNING
          id,
          media_url,
          media_public_id,
          updated_at;
      `,
      [
        newCloudinaryAsset.secure_url,
        newCloudinaryAsset.public_id,
        achievementId,
      ]
    );

    if (updateResult.rows.length === 0) {
      /*
       * Database update failed.
       * Remove the newly uploaded Cloudinary asset.
       */
      await cloudinaryService.deleteAsset(
        newCloudinaryAsset.public_id,
        {
          resourceType: "image",
        }
      );

      return null;
    }

    /*
     * Delete the old Cloudinary asset after
     * PostgreSQL successfully points to the new one.
     */
    if (achievement.media_public_id) {
      try {
        await cloudinaryService.deleteAsset(
          achievement.media_public_id,
          {
            resourceType: "image",
          }
        );
      } catch (cleanupError) {
        /*
         * New media is already active.
         * Log the orphan cleanup failure.
         */
        console.error(
          "Achievement media updated but old Cloudinary asset could not be deleted:",
          {
            achievementId,
            oldCloudinaryPublicId:
              achievement.media_public_id,
            newCloudinaryPublicId:
              newCloudinaryAsset.public_id,
            error: cleanupError,
          }
        );
      }
    }

    return updateResult.rows[0];
  } catch (error) {
    /*
     * Cloudinary upload succeeded but PostgreSQL failed.
     * Remove the newly uploaded asset.
     */
    if (newCloudinaryAsset?.public_id) {
      try {
        await cloudinaryService.deleteAsset(
          newCloudinaryAsset.public_id,
          {
            resourceType: "image",
          }
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up new achievement media:",
          cleanupError
        );
      }
    }

    throw error;
  }
};

const deleteAchievementMedia = async (achievementId) => {
  /*
   * Get current achievement media.
   */
  const achievementResult = await pool.query(
    `
      SELECT
        id,
        media_public_id
      FROM achievements
      WHERE id = $1;
    `,
    [achievementId]
  );

  if (achievementResult.rows.length === 0) {
    return null;
  }

  const achievement = achievementResult.rows[0];

  /*
   * No media exists.
   */
  if (!achievement.media_public_id) {
    return {
      id: achievement.id,
      media_deleted: false,
    };
  }

  /*
   * Remove the database reference first.
   */
  await pool.query(
    `
      UPDATE achievements
      SET
        media_url = NULL,
        media_public_id = NULL,
        updated_at = NOW()
      WHERE id = $1;
    `,
    [achievementId]
  );

  /*
   * Remove Cloudinary asset.
   */
  try {
    await cloudinaryService.deleteAsset(
      achievement.media_public_id,
      {
        resourceType: "image",
      }
    );
  } catch (error) {
    console.error(
      "Achievement media removed from database but Cloudinary deletion failed:",
      {
        achievementId,
        cloudinaryPublicId:
          achievement.media_public_id,
        error,
      }
    );

    throw error;
  }

  return {
    id: achievement.id,
    media_deleted: true,
    cloudinary_public_id:
      achievement.media_public_id,
  };
};

export default {
  uploadAchievementMedia,
  deleteAchievementMedia,
};