import { Resend } from "resend";

import env from "../config/env.js";

const resend = new Resend(env.email.resendApiKey);

const sendContactNotification = async ({
  name,
  email,
  subject,
  message,
}) => {
  const receivedAt = new Date().toISOString();

  const emailSubject = `New Portfolio Contact — ${subject}`;

  const text = [
    "New Contact Message",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
    "",
    `Received: ${receivedAt}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2>New Contact Message</h2>

      <p>
        <strong>Name:</strong><br />
        ${escapeHtml(name)}
      </p>

      <p>
        <strong>Email:</strong><br />
        ${escapeHtml(email)}
      </p>

      <p>
        <strong>Subject:</strong><br />
        ${escapeHtml(subject)}
      </p>

      <p>
        <strong>Message:</strong><br />
        ${escapeHtml(message).replace(/\n/g, "<br />")}
      </p>

      <p>
        <strong>Received:</strong><br />
        ${escapeHtml(receivedAt)}
      </p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: env.email.from,
      to: env.email.notificationEmail,
      replyTo: email,
      subject: emailSubject,
      text,
      html,
    });

    if (error) {
      const providerError = new Error("Resend email delivery failed");

      providerError.providerError = {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      };

      throw providerError;
    }

    return {
      success: true,
      id: data?.id || null,
    };
  } catch (error) {
    console.error("Contact notification email failed:", {
      message: error.message,
      providerError: error.providerError,
    });

    return {
      success: false,
    };
  }
};

const escapeHtml = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export default {
  sendContactNotification,
};