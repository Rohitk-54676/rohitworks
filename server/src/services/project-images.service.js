import pool from "../db/pool.js";
import cloudinaryService from "./cloudinary.service.js";

const createProjectImage = async ({
  projectId,
  file,
  altText = null,
  displayOrder = 0,
}) => {
  /*
   * Check that the project exists BEFORE uploading to Cloudinary.
   * This prevents uploading an asset that can never be associated
   * with a valid project.
   */
  const projectResult = await pool.query(
    `
      SELECT id
      FROM projects
      WHERE id = $1;
    `,
    [projectId]
  );

  if (projectResult.rows.length === 0) {
    return null;
  }

  let cloudinaryAsset;

  try {
    /*
     * Upload the actual file to Cloudinary.
     */
    cloudinaryAsset = await cloudinaryService.uploadBuffer(
      file.buffer,
      {
        folder: "portfolio/projects",
        resourceType: "image",
      }
    );

    /*
     * Store only the Cloudinary reference and useful metadata
     * in PostgreSQL.
     */
    const imageResult = await pool.query(
      `
        INSERT INTO project_images (
          project_id,
          cloudinary_public_id,
          url,
          alt_text,
          width,
          height,
          display_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          project_id,
          cloudinary_public_id,
          url,
          alt_text,
          width,
          height,
          display_order,
          created_at;
      `,
      [
        projectId,
        cloudinaryAsset.public_id,
        cloudinaryAsset.secure_url,
        altText,
        cloudinaryAsset.width || null,
        cloudinaryAsset.height || null,
        displayOrder,
      ]
    );

    return imageResult.rows[0];
  } catch (error) {
    /*
     * Cloudinary may have succeeded while PostgreSQL failed.
     *
     * Remove the Cloudinary asset so we don't leave an orphan.
     */
    if (cloudinaryAsset?.public_id) {
      try {
        await cloudinaryService.deleteAsset(
          cloudinaryAsset.public_id,
          {
            resourceType: "image",
          }
        );
      } catch (cleanupError) {
        /*
         * Preserve the original error.
         *
         * Cleanup failure should not hide the actual database/
         * upload failure that caused this operation to fail.
         */
        console.error(
          "Failed to clean up Cloudinary asset:",
          cleanupError
        );
      }
    }

    throw error;
  }
};


const deleteProjectImage = async ({
  projectId,
  imageId,
}) => {
  /*
   * First retrieve the database record.
   *
   * This also verifies that the image belongs to the
   * project supplied in the request.
   */
  const imageResult = await pool.query(
    `
      SELECT
        id,
        project_id,
        cloudinary_public_id
      FROM project_images
      WHERE id = $1
        AND project_id = $2;
    `,
    [imageId, projectId]
  );

  if (imageResult.rows.length === 0) {
    return null;
  }

  const image = imageResult.rows[0];

  /*
   * Delete the database reference first.
   *
   * If this fails, we do NOT touch Cloudinary.
   */
  const deleteResult = await pool.query(
    `
      DELETE FROM project_images
      WHERE id = $1
        AND project_id = $2
      RETURNING id;
    `,
    [imageId, projectId]
  );

  if (deleteResult.rows.length === 0) {
    return null;
  }

  /*
   * PostgreSQL reference has now been removed.
   *
   * Delete the corresponding Cloudinary asset.
   */
  try {
    await cloudinaryService.deleteAsset(
      image.cloudinary_public_id,
      {
        resourceType: "image",
      }
    );
  } catch (error) {
    /*
     * The database row is already gone.
     *
     * We cannot roll back the PostgreSQL operation because
     * Cloudinary and PostgreSQL are separate systems.
     *
     * Log the failure so the orphaned Cloudinary asset can
     * be identified and cleaned up.
     */
    console.error(
      "Project image deleted from database but Cloudinary deletion failed:",
      {
        imageId,
        projectId,
        cloudinaryPublicId: image.cloudinary_public_id,
        error,
      }
    );

    throw error;
  }

  return {
    id: image.id,
    project_id: image.project_id,
    cloudinary_public_id: image.cloudinary_public_id,
  };
};


const replaceProjectImage = async ({
  projectId,
  imageId,
  file,
  altText,
  displayOrder,
}) => {
  /*
   * First retrieve the existing image.
   *
   * This verifies that the image belongs to the
   * specified project.
   */
  const imageResult = await pool.query(
    `
      SELECT
        id,
        project_id,
        cloudinary_public_id,
        url,
        alt_text,
        width,
        height,
        display_order
      FROM project_images
      WHERE id = $1
        AND project_id = $2;
    `,
    [imageId, projectId]
  );

  if (imageResult.rows.length === 0) {
    return null;
  }

  const oldImage = imageResult.rows[0];

  let newCloudinaryAsset;

  try {
    /*
     * Upload replacement BEFORE changing PostgreSQL.
     *
     * If Cloudinary upload fails, the existing image remains
     * completely untouched.
     */
    newCloudinaryAsset = await cloudinaryService.uploadBuffer(
      file.buffer,
      {
        folder: "portfolio/projects",
        resourceType: "image",
      }
    );

    /*
     * Update PostgreSQL to point to the replacement asset.
     */
    const updateResult = await pool.query(
      `
        UPDATE project_images
        SET
          cloudinary_public_id = $1,
          url = $2,
          alt_text = $3,
          width = $4,
          height = $5,
          display_order = $6
        WHERE id = $7
          AND project_id = $8
        RETURNING
          id,
          project_id,
          cloudinary_public_id,
          url,
          alt_text,
          width,
          height,
          display_order,
          created_at;
      `,
      [
        newCloudinaryAsset.public_id,
        newCloudinaryAsset.secure_url,
        altText ?? oldImage.alt_text,
        newCloudinaryAsset.width || null,
        newCloudinaryAsset.height || null,
        displayOrder ?? oldImage.display_order,
        imageId,
        projectId,
      ]
    );

    if (updateResult.rows.length === 0) {
      /*
       * PostgreSQL update unexpectedly affected no row.
       *
       * Remove the newly uploaded asset because it is now
       * unnecessary.
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
     * PostgreSQL now points to the new image.
     *
     * Only after that do we remove the old Cloudinary asset.
     */
    try {
      await cloudinaryService.deleteAsset(
        oldImage.cloudinary_public_id,
        {
          resourceType: "image",
        }
      );
    } catch (cleanupError) {
      /*
       * The new image is already active in PostgreSQL.
       *
       * Do NOT delete the new asset just because the old asset
       * could not be removed.
       *
       * The old asset is now an orphan and should be cleaned up
       * separately.
       */
      console.error(
        "Project image replaced but old Cloudinary asset could not be deleted:",
        {
          imageId,
          projectId,
          oldCloudinaryPublicId:
            oldImage.cloudinary_public_id,
          newCloudinaryPublicId:
            newCloudinaryAsset.public_id,
          error: cleanupError,
        }
      );
    }

    return updateResult.rows[0];
  } catch (error) {
    /*
     * If Cloudinary succeeded but the PostgreSQL update failed,
     * remove the newly uploaded asset.
     *
     * The old image remains valid in PostgreSQL and Cloudinary.
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
          "Failed to clean up replacement Cloudinary asset:",
          cleanupError
        );
      }
    }

    throw error;
  }
};



export default {
  createProjectImage,
  deleteProjectImage,
  replaceProjectImage,
};