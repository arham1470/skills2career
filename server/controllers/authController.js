const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const path = require("path");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = await User.findOne({ email });
    
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "Email already registered and verified." });
      }
      // If unverified, update their details
      user.password = password;
      user.role = role;
    } else {
      user = new User({ email, password, role, isVerified: false });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = otp;
    user.verificationExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CareerBridge Account Verification</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f1f5f9; -webkit-font-smoothing: antialiased; }
    .wrapper { padding: 40px 16px 60px; background-color: #f1f5f9; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04); }
    .header-stripe { height: 5px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); }
    .logo-area { padding: 32px 32px 24px; background: #ffffff; border-bottom: 1px solid #f1f5f9; text-align: center; }
    .logo-area img { width: 320px; max-width: 90%; height: auto; display: block; margin: 0 auto; }
    .hero { padding: 32px 32px 0; text-align: center; }
    .badge-circle { display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 68px; border-radius: 50%; background: #e0e7ff; border: 2px solid #4f46e533; margin-bottom: 16px; box-shadow: 0 0 0 8px #e0e7ff66; }
    .type-label { display: inline-block; background: #e0e7ff; color: #3730a3; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 14px; }
    .hero-title { font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3; margin-bottom: 6px; }
    .hero-sub { font-size: 14px; color: #64748b; line-height: 1.6; }
    .content { padding: 28px 32px 32px; }
    .otp-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: monospace; font-size: 40px; font-weight: 700; color: #1e293b; letter-spacing: 12px; margin-left: 12px; }
    .otp-warning { color: #ef4444; font-size: 13px; font-weight: 600; margin-top: 12px; }
    .body-text { font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 0; text-align: center; }
    .divider { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 28px 0; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center; }
    .footer-brand { font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
    .footer-text { font-size: 12px; color: #94a3b8; line-height: 1.6; }
    .footer-divider { height: 1px; background: #e2e8f0; margin: 14px auto; max-width: 80px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header-stripe"></div>
      <div class="logo-area">
        <img src="cid:careerbridgelogo" alt="CareerBridge" />
      </div>
      <div class="hero">
        <div class="badge-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div><br/>
        <span class="type-label">Welcome</span>
        <div class="hero-title">Verify Your Account</div>
        <div class="hero-sub">Welcome to CareerBridge! Please verify your email to complete your registration.</div>
      </div>
      <div class="content">
        <p class="body-text">Use the following One-Time Password (OTP) to verify your account.</p>
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="otp-warning">⚠️ This code will expire in 10 minutes.</div>
        </div>
        <div class="divider"></div>
      </div>
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

    // await sendEmail({
    //   email: user.email,
    //   subject: "Welcome to CareerBridge - Verify Your Account",
    //   message: `Your verification OTP is ${otp}`,
    //   html: emailHtml,
    //   attachments: [{ filename: 'logo.png', path: path.join(__dirname, '../../client/src/assets/logo.png'), cid: 'careerbridgelogo' }]
    // });

    res.status(201).json({ message: "Verification OTP sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

exports.verifyRegistration = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      verificationOTP: otp,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "OTP is invalid or has expired." });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Account verified and created successfully!",
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email to log in." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "There is no user with that email address." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2-minute expiration time
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 2 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const message = `Your password reset OTP is ${otp}. It is valid for 2 minutes.`;
    
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CareerBridge Password Reset</title>
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

    .card {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04);
    }

    .header-stripe {
      height: 5px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    }

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
      background: #e0e7ff;
      border: 2px solid #4f46e533;
      margin-bottom: 16px;
      box-shadow: 0 0 0 8px #e0e7ff66;
    }
    .badge-circle svg {
      width: 32px;
      height: 32px;
      display: block;
    }
    .type-label {
      display: inline-block;
      background: #e0e7ff;
      color: #3730a3;
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

    .content {
      padding: 28px 32px 32px;
    }

    .otp-box {
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-code {
      font-family: monospace;
      font-size: 40px;
      font-weight: 700;
      color: #1e293b;
      letter-spacing: 12px;
      margin-left: 12px;
    }
    .otp-warning {
      color: #ef4444;
      font-size: 13px;
      font-weight: 600;
      margin-top: 12px;
    }

    .body-text {
      font-size: 14px;
      color: #475569;
      line-height: 1.7;
      margin-bottom: 0;
      text-align: center;
    }

    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e2e8f0, transparent);
      margin: 28px 0;
    }

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
      .otp-code { font-size: 32px; letter-spacing: 8px; margin-left: 8px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header-stripe"></div>
      
      <div class="logo-area">
        <img src="cid:careerbridgelogo" alt="CareerBridge" />
      </div>

      <div class="hero">
        <div class="badge-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div><br/>
        <span class="type-label">Security</span>
        <div class="hero-title">Password Reset Request</div>
        <div class="hero-sub">We received a request to reset your password for your CareerBridge account.</div>
      </div>

      <div class="content">
        <p class="body-text">Please use the following One-Time Password (OTP) to proceed.</p>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="otp-warning">⚠️ This code will expire in 2 minutes.</div>
        </div>

        <p class="body-text" style="font-size: 13px;">
          If you did not request a password reset, please ignore this email or contact support if you have concerns.
        </p>

        <div class="divider"></div>
      </div>

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

    const emailSent = await sendEmail({
      email: user.email,
      subject: "Password Reset OTP - CareerBridge",
      message,
      html: emailHtml,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, '../../client/src/assets/logo.png'),
          cid: 'careerbridgelogo',
        }
      ]
    });

    if (!emailSent) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: "There was an error sending the email. Try again later!" });
    }

    res.status(200).json({ message: "OTP sent to email!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "OTP is invalid or has expired." });
    }

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "OTP is invalid or has expired." });
    }

    // Set the new password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};