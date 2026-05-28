const Course = require("../models/Course");
const Institution = require("../models/Institution");

exports.matchCourses = async (req, res) => {
  try {
    const { educationLevel, olPasses, olMandatorySubjects, alStream, alPasses, gpa, fieldOfStudy } = req.body;

    if (!educationLevel) {
      return res.status(400).json({ success: false, message: "Education level is required" });
    }

    // Build base query
    const query = { isActive: true, educationLevel };

    const courses = await Course.find(query).populate("institution", "name location");

    // Filter courses based on requirements
    const matchedCourses = courses.filter((course) => {
      const req = course.requirements || {};

      switch (educationLevel) {
        case "O/L": {
          // Check O/L passes
          if (req.olPasses != null && olPasses != null && olPasses < req.olPasses) {
            return false;
          }
          // Check mandatory subjects (user must have all mandatory subjects)
          if (req.olMandatorySubjects && req.olMandatorySubjects.length > 0 && olMandatorySubjects) {
            const userSubjects = Array.isArray(olMandatorySubjects)
              ? olMandatorySubjects.map((s) => s.toLowerCase().trim())
              : [];
            const mandatory = req.olMandatorySubjects.map((s) => s.toLowerCase().trim());
            const hasAll = mandatory.every((sub) => userSubjects.includes(sub));
            if (!hasAll) return false;
          }
          return true;
        }
        case "A/L": {
          // Check A/L stream
          if (req.alStream && req.alStream !== "Any" && req.alStream !== alStream) {
            return false;
          }
          // Check A/L passes
          if (req.alPasses != null && alPasses != null && alPasses < req.alPasses) {
            return false;
          }
          return true;
        }
        case "HND":
        case "Bachelor":
        case "Diploma": {
          // Check GPA (optional - only if user provides one and course requires one)
          if (req.gpa != null && gpa != null && gpa < req.gpa) {
            return false;
          }
          // Check required field of study
          if (
            req.requiredField &&
            req.requiredField !== "Any" &&
            fieldOfStudy &&
            fieldOfStudy !== req.requiredField
          ) {
            return false;
          }
          return true;
        }
        default:
          return true;
      }
    });

    res.json({
      success: true,
      count: matchedCourses.length,
      courses: matchedCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEducationLevels = async (req, res) => {
  try {
    const levels = ["O/L", "A/L", "HND", "Bachelor", "Diploma"];
    res.json({ success: true, levels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
