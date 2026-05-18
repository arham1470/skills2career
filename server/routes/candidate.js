const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const SeekerProfile = require("../models/SeekerProfile");

router.get("/", verifyToken, requireRole("employer"), async (req, res) => {
  try {
    const { skills, location, availability, search, page = 1, limit = 9, category, expectedSalary, qualificationLevel, language, languageLevel } = req.query;
    const query = {};
    const andConditions = [];

    if (search) {
      andConditions.push({
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { skills: { $regex: search, $options: "i" } },
          { coreSkills: { $regex: search, $options: "i" } },
          { additionalSkills: { $regex: search, $options: "i" } }
        ]
      });
    }

    if (location) {
      andConditions.push({
        $or: [
          { address: { $regex: location, $options: "i" } },
          { "preferences.preferredLocations": location }
        ]
      });
    }

    if (availability) query.availability = availability;

    if (skills) {
      const skillArray = skills.split(",").map(s => s.trim()).filter(Boolean);
      if (skillArray.length > 0) {
        andConditions.push({
          $or: [
            { skills: { $in: skillArray } },
            { coreSkills: { $in: skillArray } },
            { additionalSkills: { $in: skillArray } }
          ]
        });
      }
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    if (category) {
      query["preferences.categories"] = category;
    }

    if (expectedSalary) {
      query["preferences.expectedSalary"] = expectedSalary;
    }

    if (qualificationLevel) {
      query["education.qualificationLevel"] = qualificationLevel;
    }

    if (language) {
      query["languages.language"] = language;
    }

    if (languageLevel) {
      query["languages.level"] = languageLevel;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const candidates = await SeekerProfile.find(query)
      .populate("user", "email isSuspended")
      .select("user fullName phone address availability interests skills coreSkills additionalSkills languages education experience projects references certificates profileTitle summary profileImage cvFile preferences")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Exclude suspended users
    const activeCandidates = candidates.filter(c => c.user && !c.user.isSuspended);
    const total = await SeekerProfile.countDocuments(query);

    res.status(200).json({
      candidates: activeCandidates,
      pagination: { page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), total }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to search candidates", error: error.message });
  }
});

module.exports = router;