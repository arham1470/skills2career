require("dotenv").config();
const sendEmail = require("./utils/sendEmail");

(async () => {
  console.log("Testing email with user:", process.env.EMAIL_USER);
  const result = await sendEmail({
    email: process.env.EMAIL_USER, // Send to themselves for testing
    subject: "Test Email from Skills2Career",
    message: "This is a test email to verify Nodemailer is working."
  });
  console.log("Result:", result);
  process.exit(0);
})();
