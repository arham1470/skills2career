const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const { getPreferences, updatePreferences } = require("../controllers/seekerController");

// Renamed middleware imports to avoid collision with controller functions
const { 
  uploadProfile, 
  uploadCertificate: uploadCertFile, 
  uploadCV: uploadCVFile 
} = require("../middleware/upload");

const {
  getProfile, updateProfile, uploadProfileImage, updatePassword,
  getResume, updateResume,
  getCertificates, uploadCertificate, deleteCertificate,
  getCV, uploadCV,
  getDashboardStats,
  deleteAccount,
  saveCareerQuiz,
  getCareerQuiz
} = require("../controllers/seekerController");

// All routes require seeker authentication
router.use(verifyToken, requireRole("seeker"));

router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);

// Profile & Auth
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/image", uploadProfile.single("profileImage"), uploadProfileImage);
router.put("/password", updatePassword);
router.delete("/account", deleteAccount);

// Resume
router.get("/resume", getResume);
router.put("/resume", updateResume);

// Certificates
router.get("/certificates", getCertificates);
router.post("/certificates", uploadCertFile.single("certificateFile"), uploadCertificate);
router.delete("/certificates/:id", deleteCertificate);

// CV
router.get("/cv", getCV);
router.post("/cv", uploadCVFile.single("cvFile"), uploadCV);

// Dashboard Stats
router.get("/dashboard-stats", getDashboardStats);

// Career Assessment Quiz
router.get("/career-quiz", getCareerQuiz);
router.post("/career-quiz", saveCareerQuiz);

module.exports = router;