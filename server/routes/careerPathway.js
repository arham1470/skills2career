const express = require("express");
const router = express.Router();
const {
  matchCourses,
  getEducationLevels,
} = require("../controllers/careerPathwayController");

router.get("/levels", getEducationLevels);
router.post("/match", matchCourses);

module.exports = router;
