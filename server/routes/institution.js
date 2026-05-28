const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
  getInstitutions,
  getAllInstitutions,
  getInstitution,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} = require("../controllers/institutionController");

// Public routes
router.get("/public", getInstitutions);
router.get("/public/:id", getInstitution);

// Admin protected routes
router.get("/", verifyToken, requireRole("admin"), getAllInstitutions);
router.get("/:id", verifyToken, requireRole("admin"), getInstitution);
router.post("/", verifyToken, requireRole("admin"), createInstitution);
router.put("/:id", verifyToken, requireRole("admin"), updateInstitution);
router.delete("/:id", verifyToken, requireRole("admin"), deleteInstitution);

module.exports = router;
