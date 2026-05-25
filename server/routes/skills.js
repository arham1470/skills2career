const express = require("express");
const router = express.Router();
const skillsDatabase = require("../data/skillsDatabase");

// Get all categories
router.get("/categories", (req, res) => {
  try {
    const categories = Object.keys(skillsDatabase);
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
});

// Get skills by category
router.get("/category/:category", (req, res) => {
  try {
    const { category } = req.params;
    const skills = skillsDatabase[category];
    
    if (!skills) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ 
      category,
      coreSkills: skills.coreSkills,
      additionalSkills: skills.additionalSkills 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch skills", error: error.message });
  }
});

// Search skills across all categories
router.get("/search", (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    
    const searchTerm = query.toLowerCase().trim();
    const results = [];
    
    Object.entries(skillsDatabase).forEach(([category, skills]) => {
      const matchingCore = skills.coreSkills.filter(skill => 
        skill.toLowerCase().includes(searchTerm)
      );
      const matchingAdditional = skills.additionalSkills.filter(skill => 
        skill.toLowerCase().includes(searchTerm)
      );
      
      if (matchingCore.length > 0 || matchingAdditional.length > 0) {
        results.push({
          category,
          coreSkills: matchingCore,
          additionalSkills: matchingAdditional
        });
      }
    });
    
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
});

module.exports = router;
