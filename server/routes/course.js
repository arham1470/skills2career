const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
  getCourses,
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

// Public routes
router.get("/public", getCourses);
router.get("/public/:id", getCourse);

// Admin protected routes
router.get("/", verifyToken, requireRole("admin"), getAllCourses);
router.get("/:id", verifyToken, requireRole("admin"), getCourse);
router.post("/", verifyToken, requireRole("admin"), createCourse);
router.put("/:id", verifyToken, requireRole("admin"), updateCourse);
router.delete("/:id", verifyToken, requireRole("admin"), deleteCourse);

module.exports = router;
