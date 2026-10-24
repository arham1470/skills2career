const Mailjet = require("node-mailjet");
const fs = require("fs");

const sendEmail = async (options) => {
  try {
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
      throw new Error(
        "MAILJET_API_KEY and MAILJET_API_SECRET must be configured."
      );
    }

    const mailjet = Mailjet.apiConnect(
      process.env.MAILJET_API_KEY,
      process.env.MAILJET_API_SECRET
    );

    const senderEmail =
      process.env.MAILJET_SENDER_EMAIL ||
      process.env.EMAIL_USER ||
      "noreply@skills2career.com";

    const messageData = {
      From: {
        Email: senderEmail,
        Name: "CareerBridge",
      },
      To: [
        {
          Email: options.email,
        },
      ],
      Subject: options.subject,
      TextPart: options.message || "",
      HTMLPart: options.html || options.message || "",
    };

    // Attachments / Inlined resources
    if (options.attachments && Array.isArray(options.attachments)) {
      const inlined = [];
      const regular = [];

      for (const att of options.attachments) {
        if (att.path && fs.existsSync(att.path)) {
          try {
            const content = fs.readFileSync(att.path).toString("base64");
            const item = {
              ContentType: att.contentType || "image/png",
              Filename: att.filename || "attachment.png",
              Base64Content: content,
            };
            if (att.cid) {
              item.ContentID = att.cid;
              inlined.push(item);
            } else {
              regular.push(item);
            }
          } catch (e) {
            console.warn("Could not load email attachment:", att.path, e.message);
          }
        }
      }

      if (inlined.length > 0) messageData.InlinedAttachments = inlined;
      if (regular.length > 0) messageData.Attachments = regular;
    }

    const result = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [messageData],
      });

    console.log("Mailjet email sent successfully:", result.body?.Messages?.[0]?.Status || "Success");
    return true;
  } catch (error) {
    const errorDetails = error.response?.data || error.response?.text || error.message;
    console.error("Mailjet send email error:", errorDetails);
    return false;
  }
};

module.exports = sendEmail;