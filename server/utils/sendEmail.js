const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    let transporter;

    if (process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET) {
      transporter = nodemailer.createTransport({
        host: "in-v3.mailjet.com",
        port: 587,
        auth: {
          user: process.env.MAILJET_API_KEY,
          pass: process.env.MAILJET_API_SECRET,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });
    }

    const senderEmail =
      process.env.MAILJET_SENDER_EMAIL ||
      process.env.EMAIL_USER ||
      "noreply@skills2career.com";

    const mailOptions = {
      from: `CareerBridge <${senderEmail}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

module.exports = sendEmail;