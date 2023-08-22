import nodemailer from "nodemailer";

/**
 * Sends a email to the provided email address.
 * @info This function sends a email containing the specified content to the given email address.
 *       It uses the provided sender information and SMTP server configuration to send the email.
 * @desc Handles the logic for sending emails.
 * @param {string} senderName - The name of the email sender.
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} content - The HTML content of the email.
 */
export const sendEmail = async (
  senderName: string,
  email: string,
  subject: string,
  content: string,
) => {
  const senderEmail = process.env.MAIL_FROM as string;
  const mailUser = process.env.MAIL_USER as string;
  const mailPassword = process.env.MAIL_PASSWORD as string;

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    tls: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
    auth: {
      user: mailUser,
      pass: mailPassword,
    },
  });

  const mailOptions = {
    from: `${senderName} <${senderEmail}>`,
    to: email,
    subject: subject,
    html: content,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
