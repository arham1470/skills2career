const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const { uploadCompanyLogo } = require("../middleware/upload");
const { getProfile, updateProfile, uploadLogo, getDashboardStats } = require("../controllers/companyController");

// All routes require employer authentication
router.use(verifyToken, requireRole("employer"));

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/logo", uploadCompanyLogo.single("logo"), uploadLogo);

router.get("/dashboard-stats", getDashboardStats);

module.exports = router;