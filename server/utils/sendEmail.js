const brevo = require('@getbrevo/brevo');

const sendEmail = async (options) => {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.html || options.message;

    sendSmtpEmail.sender = {
      name: "CareerBridge",
      email: "your_verified_email@gmail.com"
    };

    sendSmtpEmail.to = [
      {
        email: options.email
      }
    ];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent:", result);
    return true;

  } catch (error) {
    console.error("Brevo email error:", error);
    return false;
  }
};

module.exports = sendEmail;