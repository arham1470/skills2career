const Application = require("../models/Application");
const Internship = require("../models/Internship");
const SeekerProfile = require("../models/SeekerProfile");
const Notification = require("../models/Notification");
const skillsDatabase = require("../data/skillsDatabase");

// Normalize skill to match database standard
const normalizeSkill = (skill, category) => {
  if (!skill) return skill;
  const trimmed = skill.trim();
  
  if (!category || !skillsDatabase[category]) {
    return trimmed;
  }
  
  const categorySkills = skillsDatabase[category];
  const allSkills = [...(categorySkills.coreSkills || []), ...(categorySkills.additionalSkills || [])];
  
  // Try exact match (case-insensitive)
  const exactMatch = allSkills.find(s => s.toLowerCase() === trimmed.toLowerCase());
  if (exactMatch) return exactMatch;
  
  // Try partial match (skill contains input or input contains skill)
  const partialMatch = allSkills.find(s => 
    s.toLowerCase().includes(trimmed.toLowerCase()) || 
    trimmed.toLowerCase().includes(s.toLowerCase())
  );
  if (partialMatch) return partialMatch;
  
  // Return original if no match found
  return trimmed;
};

const calculateSingleMatch = (seekerSkills, targetSkills, category = null) => {
  if (!targetSkills || targetSkills.length === 0) return 0;
  
  // Normalize skills for better matching
  const normalizedSeekerSkills = seekerSkills.map(s => normalizeSkill(s, category));
  const normalizedTargetSkills = targetSkills.map(s => normalizeSkill(s, category));
  
  const seekerSet = new Set(normalizedSeekerSkills.map(s => s.toLowerCase().trim()));
  const matchCount = normalizedTargetSkills.filter(skill => seekerSet.has(skill.toLowerCase().trim())).length;
  return Math.round((matchCount / normalizedTargetSkills.length) * 100);
};

// Weighted matching: seeker core vs company core (75%), seeker additional vs company additional (25%)
const calculateMatch = (seekerCoreSkills, seekerAdditionalSkills, companyCoreSkills, companyAdditionalSkills, category = null) => {
  const coreMatch = calculateSingleMatch(seekerCoreSkills || [], companyCoreSkills, category);
  const addMatch = calculateSingleMatch(seekerAdditionalSkills || [], companyAdditionalSkills, category);
  if (!companyAdditionalSkills || companyAdditionalSkills.length === 0) {
    return coreMatch;
  }
  return Math.round((coreMatch * 0.75) + (addMatch * 0.25));
};

// SEEKER: Apply for Internship
exports.applyInternship = async (req, res) => {
  try {
    const { internshipId } = req.body;
    const seekerId = req.user.id;

    // Check if already applied
    const existing = await Application.findOne({ internship: internshipId, student: seekerId });
    if (existing) return res.status(400).json({ message: "You have already applied for this internship" });

    // Get Student CV
    const profile = await SeekerProfile.findOne({ user: seekerId }).select("cvFile skills");
    if (!profile || !profile.cvFile?.filePath) {
      return res.status(400).json({ message: "Please upload your CV in the CV section before applying" });
    }

    // Create Application
    const application = await Application.create({
      internship: internshipId,
      student: seekerId,
      cvPath: profile.cvFile.filePath
    });

    // Notify Provider
    const internship = await Internship.findById(internshipId).select("postedBy title");
    if (internship) {
      await Notification.create({
        user: internship.postedBy,
        message: `New application received for "${internship.title}"`,
        type: "info",
        link: "/employer/applications"
      });
    }

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Application failed", error: error.message });
  }
};

// SEEKER: Get My Applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate("internship", "title company mode location status")
      .sort({ appliedAt: -1 });
    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};

// EMPLOYER: Get Applications for my Internships
exports.getProviderApplications = async (req, res) => {
  try {
    // Find internships posted by this provider
    const internships = await Internship.find({ postedBy: req.user.id }).select("_id");
    const internshipIds = internships.map(i => i._id);

    // Find applications for these internships
    const applications = await Application.find({ internship: { $in: internshipIds } })
      .populate("internship", "title company coreSkills additionalSkills")
      .populate("student", "email") // Basic user info
      .sort({ appliedAt: -1 });

    // Enrich with Student Profile Data & Match %
    const enriched = await Promise.all(applications.map(async (app) => {
      const profile = await SeekerProfile.findOne({ user: app.student._id })
        .select("fullName phone address availability interests skills coreSkills additionalSkills languages education experience projects references certificates profileTitle summary profileImage cvFile")
        .populate("user", "email");
      const seekerCoreSkills = profile?.coreSkills?.length ? profile.coreSkills : (profile?.skills || []);
      const seekerAdditionalSkills = profile?.additionalSkills || [];
      const match = calculateMatch(
        seekerCoreSkills,
        seekerAdditionalSkills,
        app.internship.coreSkills || [],
        app.internship.additionalSkills || [],
        app.internship.category
      );
      return {
        ...app.toObject(),
        studentName: profile?.fullName || app.student.email,
        studentSkills: [
          ...(profile?.coreSkills || []),
          ...(profile?.additionalSkills || []),
          ...(profile?.skills || [])
        ],
        studentImage: profile?.profileImage,
        matchPercentage: match,
        resume: profile ? {
          fullName: profile.fullName,
          phone: profile.phone,
          address: profile.address,
          availability: profile.availability,
          interests: profile.interests,
          skills: profile.skills,
          coreSkills: profile.coreSkills,
          additionalSkills: profile.additionalSkills,
          languages: profile.languages,
          education: profile.education,
          experience: profile.experience,
          projects: profile.projects,
          references: profile.references,
          certificates: profile.certificates,
          profileTitle: profile.profileTitle,
          summary: profile.summary,
          profileImage: profile.profileImage,
          cvFile: profile.cvFile,
          user: profile.user
        } : null
      };
    }));

    res.status(200).json({ applications: enriched });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};

// EMPLOYER: Update Status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id).populate("internship", "title postedBy").populate("student", "email");
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Security check
    if (application.internship.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    // Notify Student
    let msgType = "info";
    if (status === "Selected") msgType = "success";
    if (status === "Rejected") msgType = "warning";

    await Notification.create({
      user: application.student._id,
      message: `Your application for "${application.internship.title}" has been ${status}`,
      type: msgType,
      link: "/seeker/applications"
    });

    res.status(200).json({ message: `Status updated to ${status}`, application });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};