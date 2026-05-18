const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
  createInterview,
  getEmployerInterviews,
  getSeekerInterviews,
  updateInterview,
} = require("../controllers/interviewController");

router.post("/", verifyToken, requireRole("employer"), createInterview);
router.get("/employer", verifyToken, requireRole("employer"), getEmployerInterviews);
router.get("/seeker", verifyToken, requireRole("seeker"), getSeekerInterviews);
router.patch("/:id", verifyToken, requireRole("employer"), updateInterview);

module.exports = router;
