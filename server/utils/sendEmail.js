const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {

    console.log("EMAIL_USER =", process.env.EMAIL_USER);
    console.log("EMAIL_PASS_EXISTS =", !!process.env.EMAIL_APP_PASSWORD);

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Define the email options
    const mailOptions = {
      from: `CareerBridge <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
      attachments: options.attachments || [],
    };

    await transporter.verify();
    console.log("SMTP Connection Successful");
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendEmail;
