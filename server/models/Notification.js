const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
const path = require("path");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "success", "warning"], default: "info" },
    read: { type: Boolean, default: false },
    link: { type: String } // Optional link to navigate to
  },
  { timestamps: true }
);

notificationSchema.post("save", async function(doc) {
  try {
    // Populate the user to get their email address
    await doc.populate("user", "email");

    if (doc.user && doc.user.email) {
      const emailText = `Hello,\n\nYou have a new notification on CareerBridge:\n\n"${doc.message}"\n\nPlease log in to your account to view the details.\n\nBest regards,\nCareerBridge Team`;

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

      // Type-based accent colors matching the website palette
      const typeConfig = {
        success: {
          accent:      "#10b981",
          accentLight: "#d1fae5",
          accentDark:  "#059669",
          icon:        `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
          subjectIcon: "✅",
          label:       "Success",
          btnGrad:     "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          btnShadow:   "rgba(16, 185, 129, 0.35)",
        },
        warning: {
          accent:      "#f59e0b",
          accentLight: "#fef3c7",
          accentDark:  "#d97706",
          icon:        `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
          subjectIcon: "⚠️",
          label:       "Action Required",
          btnGrad:     "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          btnShadow:   "rgba(245, 158, 11, 0.35)",
        },
        info: {
          accent:      "#2563eb",
          accentLight: "#eff6ff",
          accentDark:  "#1d4ed8",
          icon:        `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
          subjectIcon: "🔔",
          label:       "New Notification",
          btnGrad:     "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          btnShadow:   "rgba(37, 99, 235, 0.35)",
        },
      };

      const t = typeConfig[doc.type] || typeConfig.info;

      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CareerBridge Notification</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', Helvetica, Arial, sans-serif;
      background-color: #f1f5f9;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      padding: 40px 16px 60px;
      background-color: #f1f5f9;
    }

    /* ── Main card ── */
    .card {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04);
    }

    /* ── Header stripe ── */
    .header-stripe {
      height: 5px;
      background: ${t.btnGrad};
    }

    /* ── Logo area ── */
    .logo-area {
      padding: 32px 32px 24px;
      background: #ffffff;
      border-bottom: 1px solid #f1f5f9;
      text-align: center;
    }
    .logo-area img {
      width: 320px;
      max-width: 90%;
      height: auto;
      display: block;
      margin: 0 auto;
    }

    /* ── Hero badge ── */
    .hero {
      padding: 32px 32px 0;
      text-align: center;
    }
    .badge-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: ${t.accentLight};
      border: 2px solid ${t.accent}33;
      margin-bottom: 16px;
      box-shadow: 0 0 0 8px ${t.accentLight}66;
    }
    .badge-circle svg {
      width: 32px;
      height: 32px;
      display: block;
    }
    .type-label {
      display: inline-block;
      background: ${t.accentLight};
      color: ${t.accentDark};
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 14px;
    }
    .hero-title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.3;
      margin-bottom: 6px;
    }
    .hero-sub {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
    }

    /* ── Content ── */
    .content {
      padding: 28px 32px 32px;
    }

    /* ── Message card ── */
    .message-card {
      background: ${t.accentLight};
      border: 1px solid ${t.accent}30;
      border-left: 4px solid ${t.accent};
      border-radius: 12px;
      padding: 18px 20px;
      margin: 24px 0;
      box-shadow: 0 2px 8px ${t.accent}10;
    }
    .message-card-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: ${t.accentDark};
      margin-bottom: 8px;
    }
    .message-card-label svg {
      width: 13px;
      height: 13px;
      flex-shrink: 0;
    }
    .message-card-text {
      font-size: 15px;
      font-weight: 500;
      color: #1e293b;
      line-height: 1.6;
    }

    /* ── Body copy ── */
    .body-text {
      font-size: 14px;
      color: #475569;
      line-height: 1.7;
      margin-bottom: 0;
    }

    /* ── Divider ── */
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e2e8f0, transparent);
      margin: 28px 0;
    }

    /* ── CTA Button ── */
    .btn-wrap {
      text-align: center;
      margin: 28px 0 8px;
    }
    .btn {
      display: inline-block;
      background: ${t.btnGrad};
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 40px;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.3px;
      box-shadow: 0 4px 14px ${t.btnShadow};
    }

    /* ── Footer ── */
    .footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 24px 32px;
      text-align: center;
    }
    .footer-brand {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 6px;
    }
    .footer-text {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.6;
    }
    .footer-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 14px auto;
      max-width: 80px;
    }

    @media (max-width: 600px) {
      .wrapper { padding: 20px 12px 40px; }
      .logo-area, .hero, .content, .footer { padding-left: 20px; padding-right: 20px; }
      .hero-title { font-size: 18px; }
      .btn { display: block; text-align: center; padding: 14px 24px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">

      <!-- Top accent stripe -->
      <div class="header-stripe"></div>

      <!-- Logo -->
      <div class="logo-area">
        <img src="cid:careerbridgelogo" alt="CareerBridge" />
      </div>

      <!-- Hero badge -->
      <div class="hero">
        <div class="badge-circle">${t.icon}</div><br/>
        <span class="type-label">${t.label}</span>
        <div class="hero-title">You have a new notification</div>
        <div class="hero-sub">Here's what happened on your CareerBridge account.</div>
      </div>

      <!-- Content -->
      <div class="content">

        <!-- Message card -->
        <div class="message-card">
          <div class="message-card-label"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${t.accentDark}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Message</div>
          <div class="message-card-text">${doc.message}</div>
        </div>

        <p class="body-text">
          Log in to your dashboard to view the full details and take any necessary action.
        </p>

        <div class="divider"></div>

        <!-- CTA -->
        <div class="btn-wrap">
          <a href="${clientUrl}/login" class="btn">View Dashboard →</a>
        </div>

      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-brand">CareerBridge</div>
        <div class="footer-divider"></div>
        <div class="footer-text">
          &copy; ${new Date().getFullYear()} CareerBridge. All rights reserved.<br/>
          This is an automated message — please do not reply to this email.
        </div>
      </div>

    </div>
  </div>
</body>
</html>`;

      // We don't await this so it doesn't block the DB save operation
      sendEmail({
        email: doc.user.email,
        subject: `${t.subjectIcon} ${t.label} — CareerBridge`,
        message: emailText,
        html: emailHtml,
        attachments: [
          {
            filename: 'logo.png',
            path: path.join(__dirname, '../../client/src/assets/logo.png'),
            cid: 'careerbridgelogo', // same cid value as in the html img src
          }
        ]
      });
    }
  } catch (error) {
    console.error("Error sending email for notification:", error);
  }
});

module.exports = mongoose.model("Notification", notificationSchema);