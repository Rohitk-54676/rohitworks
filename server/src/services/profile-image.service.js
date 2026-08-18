import pool from "../db/pool.js";
import cloudinaryService from "./cloudinary.service.js";

const uploadProfileImage = async (file) => {
  /*
   * Get the existing profile image reference.
   *
   * site_settings is a singleton and always uses id = 1.
   */
  const settingsResult = await pool.query(
    `
      SELECT
        id,
        profile_image_url,
        profile_image_public_id
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
     * Upload replacement first.
     */
    newCloudinaryAsset =
      await cloudinaryService.uploadBuffer(
        file.buffer,
        {
          folder: "portfolio/profile",
          resourceType: "image",
        }
      );

    /*
     * Update PostgreSQL.
     */
    const updateResult = await pool.query(
      `
        UPDATE site_settings
        SET
          profile_image_url = $1,
          profile_image_public_id = $2,
          updated_at = NOW()
        WHERE id = 1
        RETURNING
          id,
          profile_image_url,
          profile_image_public_id,
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
       * Remove the newly uploaded asset.
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
     * Database now points to the new profile image.
     *
     * Delete the previous Cloudinary asset if one existed.
     */
    if (settings.profile_image_public_id) {
      try {
        await cloudinaryService.deleteAsset(
          settings.profile_image_public_id,
          {
            resourceType: "image",
          }
        );
      } catch (cleanupError) {
        /*
         * New profile image is already active.
         * Old asset is now orphaned.
         */
        console.error(
          "Profile image updated but old Cloudinary asset could not be deleted:",
          {
            oldCloudinaryPublicId:
              settings.profile_image_public_id,
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
     * Cloudinary upload succeeded but database operation failed.
     * Clean up the new asset.
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
          "Failed to clean up new profile image:",
          cleanupError
        );
      }
    }

    throw error;
  }
};

const deleteProfileImage = async () => {
  /*
   * Get current profile image.
   */
  const settingsResult = await pool.query(
    `
      SELECT
        id,
        profile_image_public_id
      FROM site_settings
      WHERE id = 1;
    `
  );

  if (settingsResult.rows.length === 0) {
    return null;
  }

  const settings = settingsResult.rows[0];

  /*
   * Nothing to delete.
   */
  if (!settings.profile_image_public_id) {
    return {
      id: settings.id,
      profile_image_deleted: false,
    };
  }

  /*
   * Remove database reference first.
   */
  await pool.query(
    `
      UPDATE site_settings
      SET
        profile_image_url = NULL,
        profile_image_public_id = NULL,
        updated_at = NOW()
      WHERE id = 1;
    `
  );

  /*
   * Remove Cloudinary asset.
   */
  try {
    await cloudinaryService.deleteAsset(
      settings.profile_image_public_id,
      {
        resourceType: "image",
      }
    );
  } catch (error) {
    console.error(
      "Profile image removed from database but Cloudinary deletion failed:",
      {
        cloudinaryPublicId:
          settings.profile_image_public_id,
        error,
      }
    );

    throw error;
  }

  return {
    id: settings.id,
    profile_image_deleted: true,
    cloudinary_public_id:
      settings.profile_image_public_id,
  };
};

export default {
  uploadProfileImage,
  deleteProfileImage,
};