const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const User = require("../models/User");
const {
  getStats, getUsers, toggleUserSuspension,
  getInternships, updateInternshipStatus, seedAdmin,
  updatePassword, deleteAccount,
  getPendingCompanies, verifyCompany, unverifyCompany
} = require("../controllers/adminController");

// Dev seed route (remove in production)
router.post("/seed", seedAdmin);

// Migration route to update user roles from student/provider to seeker/employer (public for ease of use)
router.post("/migrate-roles", async (req, res) => {
  try {
    // Update all student roles to seeker
    const studentUpdateResult = await User.updateMany(
      { role: "student" },
      { $set: { role: "seeker" } }
    );
    
    // Update all provider roles to employer
    const providerUpdateResult = await User.updateMany(
      { role: "provider" },
      { $set: { role: "employer" } }
    );

    // Get current role distribution
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      message: "Migration completed successfully",
      studentToSeeker: studentUpdateResult.modifiedCount,
      providerToEmployer: providerUpdateResult.modifiedCount,
      currentDistribution: stats
    });
  } catch (error) {
    res.status(500).json({ message: "Migration failed", error: error.message });
  }
});

// All admin routes protected
router.use(verifyToken, requireRole("admin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/suspend", toggleUserSuspension);
router.get("/internships", getInternships);
router.patch("/internships/:id/status", updateInternshipStatus);
router.get("/companies/pending", getPendingCompanies);
router.patch("/companies/:id/verify", verifyCompany);
router.patch("/companies/:id/unverify", unverifyCompany);
router.put("/password", updatePassword);
router.delete("/account", deleteAccount);

module.exports = router;