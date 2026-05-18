const express = require("express");
const router = express.Router();
// FIX: Import optionalAuth here
const { verifyToken, requireRole, optionalAuth } = require("../middleware/auth");
const {
  getRecommended, seedInternships, browseInternships,
  createInternship, getProviderInternships, updateInternship, deleteInternship, toggleStatus
} = require("../controllers/internshipController");

// Public/Seeker Browse Route
// FIX: Use optionalAuth so req.user is populated if a seeker is logged in
router.get("/browse", optionalAuth, browseInternships); 

// Seeker Routes
router.get("/recommended", verifyToken, requireRole("seeker"), getRecommended);
router.post("/seed", seedInternships); // Dev only

// Employer Routes
router.post("/", verifyToken, requireRole("employer"), createInternship);
router.get("/", verifyToken, requireRole("employer"), getProviderInternships);
router.put("/:id", verifyToken, requireRole("employer"), updateInternship);
router.delete("/:id", verifyToken, requireRole("employer"), deleteInternship);
router.patch("/:id/status", verifyToken, requireRole("employer"), toggleStatus);

module.exports = router;