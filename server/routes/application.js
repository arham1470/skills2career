const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const { applyInternship, getMyApplications, getProviderApplications, updateStatus } = require("../controllers/applicationController");

router.post("/", verifyToken, requireRole("seeker"), applyInternship);
router.get("/my", verifyToken, requireRole("seeker"), getMyApplications);
router.get("/employer", verifyToken, requireRole("employer"), getProviderApplications);
router.patch("/:id/status", verifyToken, requireRole("employer"), updateStatus);

module.exports = router;