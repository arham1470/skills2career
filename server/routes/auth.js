const express = require("express");
const router = express.Router();
const { register, login, getMe, forgotPassword, verifyOTP, resetPassword, verifyRegistration } = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

router.post("/register", register);
router.post("/verify-registration", verifyRegistration);
router.post("/login", login);
router.get("/me", verifyToken, getMe);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;