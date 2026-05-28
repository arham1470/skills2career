const Course = require("../models/Course");
const Institution = require("../models/Institution");

/**
 * Match courses based on the user's CURRENT qualification.
 * The user tells us what they already have, and we find ALL courses
 * across every level that they can enter next.
 */
exports.matchCourses = async (req, res) => {
  try {
    const {
      currentQualification, // "O/L", "A/L", "Diploma", "HND", "Bachelor"
      olPasses,
      olMandatorySubjects,
      alStream,
      alPasses,
      gpa,
      fieldOfStudy,
      qualificationName,
    } = req.body;

    if (!currentQualification) {
      return res.status(400).json({ success: false, message: "Current qualification is required" });
    }

    // Query ALL active courses — we filter by eligibility, not by level
    const courses = await Course.find({ isActive: true }).populate("institution", "name location image");

    const matchedCourses = [];

    for (const course of courses) {
      const req = course.requirements || {};
      const reasons = [];
      let isMatch = true;

      // Does this course have explicit qualification acceptance rules? (new schema)
      const hasExplicitRules =
        (course.acceptedQualificationTypes && course.acceptedQualificationTypes.length > 0) ||
        (course.acceptedQualificationNames && course.acceptedQualificationNames.length > 0);

      if (hasExplicitRules) {
        // ----- COURSE WITH EXPLICIT ACCEPTANCE RULES -----

        // 1. Check accepted qualification types
        const acceptedTypes = course.acceptedQualificationTypes || [];
        if (acceptedTypes.length > 0) {
          if (!acceptedTypes.includes(currentQualification) && !acceptedTypes.includes("Any")) {
            isMatch = false;
          } else if (isMatch) {
            reasons.push(`Accepts ${currentQualification}`);
          }
        }

        // 2. Check accepted qualification names
        const acceptedNames = course.acceptedQualificationNames || [];
        if (acceptedNames.length > 0 && qualificationName) {
          if (!acceptedNames.includes(qualificationName)) {
            isMatch = false;
          } else if (isMatch) {
            reasons.push(`Recognizes ${qualificationName}`);
          }
        }

        // 3. Check GPA
        if (req.gpa != null && gpa != null && gpa < req.gpa) {
          isMatch = false;
        } else if (isMatch && req.gpa != null && gpa != null) {
          reasons.push(`GPA ${gpa} meets ${req.gpa} minimum`);
        }

        // 4. Check field acceptance
        const fields = course.acceptedFields && course.acceptedFields.length > 0
          ? course.acceptedFields
          : [req.requiredField || "Any"];

        if (fieldOfStudy) {
          const acceptsAny = fields.includes("Any");
          if (!acceptsAny && !fields.includes(fieldOfStudy)) {
            isMatch = false;
          } else if (isMatch) {
            reasons.push(acceptsAny ? "Any field accepted" : `${fieldOfStudy} background accepted`);
          }
        }
      } else {
        // ----- COURSE WITHOUT EXPLICIT RULES (fallback by requirements) -----

        const hasOLReqs = req.olPasses != null || (req.olMandatorySubjects && req.olMandatorySubjects.length > 0);
        const hasALReqs = req.alStream || req.alPasses != null;
        const hasHigherReqs = req.gpa != null || (req.requiredField && req.requiredField !== "Any");

        if (hasOLReqs) {
          // This is an O/L-entry course (Certificate, Foundation, some Diploma)
          if (currentQualification === "O/L") {
            if (req.olPasses != null && olPasses != null && olPasses < req.olPasses) {
              isMatch = false;
            } else if (isMatch && req.olPasses != null) {
              reasons.push(`${req.olPasses}+ O/L passes`);
            }
            if (req.olMandatorySubjects?.length > 0 && olMandatorySubjects) {
              const userSubjects = Array.isArray(olMandatorySubjects)
                ? olMandatorySubjects.map((s) => s.toLowerCase().trim())
                : [];
              const mandatory = req.olMandatorySubjects.map((s) => s.toLowerCase().trim());
              if (!mandatory.every((sub) => userSubjects.includes(sub))) {
                isMatch = false;
              } else {
                reasons.push(`Required subjects: ${req.olMandatorySubjects.join(", ")}`);
              }
            }
          } else {
            // A/L, HND, Diploma, Bachelor holders are also eligible (they over-qualify)
            isMatch = true;
            reasons.push(`${currentQualification} holder — eligible for entry-level course`);
          }
        } else if (hasALReqs) {
          // This is an A/L-entry course (HND, some Diploma, some Bachelor)
          if (currentQualification === "O/L") {
            isMatch = false; // O/L alone cannot enter A/L-level courses
          } else {
            if (req.alStream && req.alStream !== "Any" && req.alStream !== alStream) {
              isMatch = false;
            } else if (isMatch && req.alStream && req.alStream !== "Any") {
              reasons.push(`${req.alStream} stream`);
            }
            if (req.alPasses != null && alPasses != null && alPasses < req.alPasses) {
              isMatch = false;
            } else if (isMatch && req.alPasses != null) {
              reasons.push(`${req.alPasses}+ A/L passes`);
            }
            if (currentQualification !== "A/L" && isMatch) {
              reasons.push(`${currentQualification} holder accepted`);
            }
          }
        } else if (hasHigherReqs) {
          // This is a higher-ed course (Bachelor, Master's) with GPA/field requirements
          if (currentQualification === "O/L") {
            isMatch = false; // O/L alone cannot enter higher-ed courses
          } else {
            if (req.gpa != null && gpa != null && gpa < req.gpa) {
              isMatch = false;
            } else if (isMatch && req.gpa != null && gpa != null) {
              reasons.push(`GPA ${gpa} meets ${req.gpa} minimum`);
            }
            if (req.requiredField && req.requiredField !== "Any") {
              if (fieldOfStudy && req.requiredField !== fieldOfStudy) {
                isMatch = false;
              } else if (isMatch) {
                reasons.push(`${req.requiredField} background accepted`);
              }
            }
          }
        } else {
          // No specific requirements — open to anyone
          reasons.push("Open entry");
        }
      }

      if (isMatch) {
        matchedCourses.push({
          ...course.toObject(),
          matchedBecause: reasons,
        });
      }
    }

    // Sort results: higher-level courses first, then by name
    matchedCourses.sort((a, b) => {
      const levelOrder = { "Bachelor": 4, "HND": 3, "Diploma": 2, "A/L": 1, "O/L": 0 };
      const diff = (levelOrder[b.educationLevel] || 0) - (levelOrder[a.educationLevel] || 0);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });

    // Fallback suggestions when no direct matches
    let suggestions = [];
    if (matchedCourses.length === 0) {
      suggestions = await Course.find({ isActive: true, educationLevel: "O/L" })
        .populate("institution", "name location image")
        .sort({ educationLevel: 1 })
        .limit(6);
    }

    res.json({
      success: true,
      count: matchedCourses.length,
      courses: matchedCourses,
      suggestions,
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
