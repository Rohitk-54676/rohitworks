import pool from "../db/pool.js";
import emailService from "./email.service.js";

const getContactMessages = async ({ unreadOnly = false } = {}) => {
  const values = [];
  let whereClause = "";

  if (unreadOnly) {
    values.push(false);
    whereClause = "WHERE is_read = $1";
  }

  const query = `
    SELECT
      id,
      name,
      email,
      subject,
      message,
      is_read,
      created_at
    FROM contact_messages
    ${whereClause}
    ORDER BY created_at DESC;
  `;

  const { rows } = await pool.query(query, values);

  return rows;
};

const createContactMessage = async (data) => {
  const {
    name,
    email,
    subject = null,
    message,
  } = data;

  const query = `
    INSERT INTO contact_messages (
      name,
      email,
      subject,
      message
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      name,
      email,
      subject,
      message,
      is_read,
      created_at;
  `;

  const values = [
    name,
    email,
    subject,
    message,
  ];

  const { rows } = await pool.query(query, values);

  const contactMessage = rows[0];

  const notificationResult =
    await emailService.sendContactNotification({
      name: contactMessage.name,
      email: contactMessage.email,
      subject: contactMessage.subject,
      message: contactMessage.message,
    });

  return {
    contactMessage,
    notificationSent: notificationResult.success,
  };
};



const markContactMessageRead = async (id, isRead) => {
  const query = `
    UPDATE contact_messages
    SET
      is_read = $1
    WHERE id = $2
    RETURNING
      id,
      name,
      email,
      subject,
      message,
      is_read,
      created_at;
  `;

  const { rows } = await pool.query(query, [
    isRead,
    id,
  ]);

  return rows[0] || null;
};

const deleteContactMessage = async (id) => {
  const query = `
    DELETE FROM contact_messages
    WHERE id = $1
    RETURNING id;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0] || null;
};

export default {
  getContactMessages,
  createContactMessage,
  markContactMessageRead,
  deleteContactMessage,
};