const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: options.email,
      subject: options.subject,
      html: options.html || options.message,
    });

    console.log("Email sent:", result);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

module.exports = sendEmail;