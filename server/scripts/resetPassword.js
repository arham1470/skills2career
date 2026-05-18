const path = require("path");
const dotenvPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: dotenvPath });
const mongoose = require("mongoose");
const User = require("../models/User");

const resetPassword = async (email, newPassword) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      process.exit(1);
    }
    user.password = newPassword;
    await user.save();
    console.log(`Password reset successfully for ${email}`);
    console.log(`New password: ${newPassword}`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

const email = process.argv[2];
const newPassword = process.argv[3] || "Test@1234";

if (!email) {
  console.log("Usage: node scripts/resetPassword.js <email> [newPassword]");
  process.exit(1);
}

resetPassword(email, newPassword);
