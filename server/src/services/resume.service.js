import pool from "../db/pool.js";
import cloudinaryService from "./cloudinary.service.js";

const uploadResume = async (file) => {
  /*
   * Get the existing resume reference.
   *
   * site_settings is a singleton and uses id = 1.
   */
  const settingsResult = await pool.query(
    `
      SELECT
        id,
        resume_url,
        resume_public_id
      FROM site_settings
      WHERE id = 1;
    `
  );

  if (settingsResult.rows.length === 0) {
    return null;
  }

  const settings = settingsResult.rows[0];

  let newCloudinaryAsset;

  try {
    /*
     * Upload the new resume first.
     *
     * PDFs are stored by Cloudinary as raw resources.
     */
    newCloudinaryAsset =
      await cloudinaryService.uploadBuffer(
        file.buffer,
        {
          folder: "portfolio/resume",
          resourceType: "raw",
        }
      );

    /*
     * Update PostgreSQL with the new Cloudinary reference.
     */
    const updateResult = await pool.query(
      `
        UPDATE site_settings
        SET
          resume_url = $1,
          resume_public_id = $2,
          updated_at = NOW()
        WHERE id = 1
        RETURNING
          id,
          resume_url,
          resume_public_id,
          updated_at;
      `,
      [
        newCloudinaryAsset.secure_url,
        newCloudinaryAsset.public_id,
      ]
    );

    if (updateResult.rows.length === 0) {
      /*
       * Database update failed.
       *
       * Remove the newly uploaded Cloudinary asset.
       */
      await cloudinaryService.deleteAsset(
        newCloudinaryAsset.public_id,
        {
          resourceType: "raw",
        }
      );

      return null;
    }

    /*
     * PostgreSQL now points to the new resume.
     *
     * Delete the old resume from Cloudinary if one existed.
     */
    if (settings.resume_public_id) {
      try {
        await cloudinaryService.deleteAsset(
          settings.resume_public_id,
          {
            resourceType: "raw",
          }
        );
      } catch (cleanupError) {
        /*
         * New resume is already active.
         *
         * The old Cloudinary asset is now orphaned.
         */
        console.error(
          "Resume updated but old Cloudinary asset could not be deleted:",
          {
            oldCloudinaryPublicId:
              settings.resume_public_id,
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
     * If Cloudinary upload succeeded but PostgreSQL failed,
     * remove the newly uploaded asset.
     */
    if (newCloudinaryAsset?.public_id) {
      try {
        await cloudinaryService.deleteAsset(
          newCloudinaryAsset.public_id,
          {
            resourceType: "raw",
          }
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up new resume:",
          cleanupError
        );
      }
    }

    throw error;
  }
};

const deleteResume = async () => {
  /*
   * Get the current resume reference.
   */
  const settingsResult = await pool.query(
    `
      SELECT
        id,
        resume_public_id
      FROM site_settings
      WHERE id = 1;
    `
  );

  if (settingsResult.rows.length === 0) {
    return null;
  }

  const settings = settingsResult.rows[0];

  /*
   * No resume currently exists.
   */
  if (!settings.resume_public_id) {
    return {
      id: settings.id,
      resume_deleted: false,
    };
  }

  /*
   * Remove the database reference first.
   */
  await pool.query(
    `
      UPDATE site_settings
      SET
        resume_url = NULL,
        resume_public_id = NULL,
        updated_at = NOW()
      WHERE id = 1;
    `,
    []
  );

  /*
   * Remove the Cloudinary raw asset.
   */
  try {
    await cloudinaryService.deleteAsset(
      settings.resume_public_id,
      {
        resourceType: "raw",
      }
    );
  } catch (error) {
    console.error(
      "Resume removed from database but Cloudinary deletion failed:",
      {
        cloudinaryPublicId:
          settings.resume_public_id,
        error,
      }
    );

    throw error;
  }

  return {
    id: settings.id,
    resume_deleted: true,
    cloudinary_public_id:
      settings.resume_public_id,
  };
};

export default {
  uploadResume,
  deleteResume,
};