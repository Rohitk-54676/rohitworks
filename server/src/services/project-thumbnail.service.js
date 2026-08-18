import pool from "../db/pool.js";
import cloudinaryService from "./cloudinary.service.js";

const uploadProjectThumbnail = async ({
  projectId,
  file,
}) => {
  /*
   * Get the existing project and current thumbnail reference.
   */
  const projectResult = await pool.query(
    `
      SELECT
        id,
        thumbnail_public_id,
        thumbnail_url
      FROM projects
      WHERE id = $1;
    `,
    [projectId]
  );

  if (projectResult.rows.length === 0) {
    return null;
  }

  const project = projectResult.rows[0];

  let newCloudinaryAsset;

  try {
    /*
     * Upload new thumbnail first.
     */
    newCloudinaryAsset =
      await cloudinaryService.uploadBuffer(
        file.buffer,
        {
          folder: "portfolio/projects/thumbnails",
          resourceType: "image",
        }
      );

    /*
     * Update PostgreSQL.
     */
    const updateResult = await pool.query(
      `
        UPDATE projects
        SET
          thumbnail_url = $1,
          thumbnail_public_id = $2,
          updated_at = NOW()
        WHERE id = $3
        RETURNING
          id,
          thumbnail_url,
          thumbnail_public_id;
      `,
      [
        newCloudinaryAsset.secure_url,
        newCloudinaryAsset.public_id,
        projectId,
      ]
    );

    if (updateResult.rows.length === 0) {
      /*
       * Database update failed unexpectedly.
       * Remove the new Cloudinary asset.
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
     * PostgreSQL now points to the new thumbnail.
     *
     * Delete the old Cloudinary asset only if one existed.
     */
    if (project.thumbnail_public_id) {
      try {
        await cloudinaryService.deleteAsset(
          project.thumbnail_public_id,
          {
            resourceType: "image",
          }
        );
      } catch (cleanupError) {
        /*
         * New thumbnail is already active.
         * Old thumbnail is now an orphan.
         *
         * Log it for cleanup rather than breaking the
         * successful thumbnail update.
         */
        console.error(
          "Project thumbnail updated but old Cloudinary asset could not be deleted:",
          {
            projectId,
            oldCloudinaryPublicId:
              project.thumbnail_public_id,
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
     * clean up the newly uploaded asset.
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
          "Failed to clean up new project thumbnail:",
          cleanupError
        );
      }
    }

    throw error;
  }
};

const deleteProjectThumbnail = async (projectId) => {
  /*
   * Get current thumbnail.
   */
  const projectResult = await pool.query(
    `
      SELECT
        id,
        thumbnail_public_id
      FROM projects
      WHERE id = $1;
    `,
    [projectId]
  );

  if (projectResult.rows.length === 0) {
    return null;
  }

  const project = projectResult.rows[0];

  /*
   * No thumbnail exists.
   */
  if (!project.thumbnail_public_id) {
    return {
      id: project.id,
      thumbnail_deleted: false,
    };
  }

  /*
   * Remove database reference first.
   */
  await pool.query(
    `
      UPDATE projects
      SET
        thumbnail_url = NULL,
        thumbnail_public_id = NULL,
        updated_at = NOW()
      WHERE id = $1;
    `,
    [projectId]
  );

  /*
   * Then remove Cloudinary asset.
   */
  try {
    await cloudinaryService.deleteAsset(
      project.thumbnail_public_id,
      {
        resourceType: "image",
      }
    );
  } catch (error) {
    console.error(
      "Project thumbnail removed from database but Cloudinary deletion failed:",
      {
        projectId,
        cloudinaryPublicId:
          project.thumbnail_public_id,
        error,
      }
    );

    throw error;
  }

  return {
    id: project.id,
    thumbnail_deleted: true,
    cloudinary_public_id:
      project.thumbnail_public_id,
  };
};

export default {
  uploadProjectThumbnail,
  deleteProjectThumbnail,
};