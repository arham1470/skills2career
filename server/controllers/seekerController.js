const SeekerProfile = require("../models/SeekerProfile");
const User = require("../models/User");
const Application = require("../models/Application");
const Internship = require("../models/Internship");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const fs = require("fs");
const path = require("path");

exports.getProfile = async (req, res) => {
  try {
    let profile = await SeekerProfile.findOne({ user: req.user.id });
    if (!profile) profile = await SeekerProfile.create({ user: req.user.id });
    res.status(200).json({ profile, email: req.user.email });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    const profile = await SeekerProfile.findOneAndUpdate(
      { user: req.user.id },
      { fullName, phone, address },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    await SeekerProfile.findOneAndUpdate({ user: req.user.id }, { profileImage: imageUrl }, { upsert: true });
    res.status(200).json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
    if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password update failed", error: error.message });
  }
};

// Resume
exports.getResume = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id })
      .select("fullName phone address profileImage profileTitle summary availability interests skills coreSkills additionalSkills languages education experience projects references")
      .populate("user", "email");
    res.status(200).json({ resume: profile || {} });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resume data", error: error.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const updateData = req.body;
    const profile = await SeekerProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ message: "Resume data saved successfully", resume: profile });
  } catch (error) {
    res.status(500).json({ message: "Failed to save resume", error: error.message });
  }
};

// Certificates
exports.getCertificates = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id }).select("certificates");
    res.status(200).json({ certificates: profile?.certificates || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch certificates", error: error.message });
  }
};

exports.uploadCertificate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Certificate file is required" });
    const { name, description, issuedDate } = req.body;
    const certData = {
      name,
      description,
      issuedDate,
      fileName: req.file.originalname,
      filePath: `/uploads/certificates/${req.file.filename}`
    };
    const profile = await SeekerProfile.findOneAndUpdate(
      { user: req.user.id },
      { $push: { certificates: certData } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Certificate uploaded", certificate: certData });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await SeekerProfile.findOne({ user: req.user.id });
    const cert = profile.certificates.id(id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    const fullPath = path.join(__dirname, "..", cert.filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    profile.certificates.pull(id);
    await profile.save();
    res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};

// CV
exports.getCV = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id }).select("cvFile");
    res.status(200).json({ cv: profile?.cvFile || {} });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch CV", error: error.message });
  }
};

exports.uploadCV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CV file is required" });
    const cvData = {
      fileName: req.file.originalname,
      filePath: `/uploads/cv/${req.file.filename}`,
      uploadedAt: new Date()
    };
    await SeekerProfile.findOneAndUpdate(
      { user: req.user.id },
      { cvFile: cvData },
      { upsert: true }
    );
    res.status(200).json({ message: "CV uploaded successfully", cv: cvData });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// Helper to calculate profile completion percentage based on 5 timeline steps
const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  // Step 1: Profile - all profile fields must be filled
  const profileStepComplete =
    !!profile.fullName &&
    !!profile.phone &&
    !!profile.address &&
    !!profile.profileImage &&
    !!profile.profileTitle &&
    !!profile.summary &&
    !!profile.availability &&
    (profile.interests?.length || 0) > 0 &&
    (profile.languages?.length || 0) > 0;

  // Step 2: Resume - all resume fields must be filled
  const resumeStepComplete =
    (profile.education?.length || 0) > 0 &&
    (profile.projects?.length || 0) > 0 &&
    (profile.references?.length || 0) > 0;

  // Step 3: Skills - both coreSkills and additionalSkills must be filled
  const skillsStepComplete =
    (profile.coreSkills?.length || 0) > 0 && (profile.additionalSkills?.length || 0) > 0;

  // Step 4: Experience - experience must be filled
  const experienceStepComplete = (profile.experience?.length || 0) > 0;

  // Step 5: Preferences - all preference fields must be filled
  const preferencesStepComplete =
    (profile.preferences?.categories?.length || 0) > 0 &&
    (profile.preferences?.workingMode?.length || 0) > 0 &&
    !!profile.preferences?.expectedSalary &&
    (profile.preferences?.preferredLocations?.length || 0) > 0 &&
    (profile.certificates?.length || 0) > 0;

  // Steps must be completed in sequential order
  const steps = [profileStepComplete, resumeStepComplete, skillsStepComplete, experienceStepComplete, preferencesStepComplete];

  // Find first incomplete step and count only completed steps before it
  let completedSteps = 0;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i]) {
      completedSteps++;
    } else {
      // Stop at first incomplete step
      break;
    }
  }

  // Each step is worth 20%
  return completedSteps * 20;
};

exports.getDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    const profile = await SeekerProfile.findOne({ user: studentId });

    // Profile completion
    const profileCompletion = calculateProfileCompletion(profile);

    // Applications sent
    const totalApplications = await Application.countDocuments({ student: studentId });

    // Shortlisted + Selected count
    const shortlisted = await Application.countDocuments({
      student: studentId,
      status: { $in: ["Shortlisted", "Selected"] }
    });

    // Skill matches: count active internships with at least one matching skill
    let skillMatches = 0;
    const studentSkills = [
      ...(profile?.coreSkills || []),
      ...(profile?.additionalSkills || []),
      ...(profile?.skills || []) // backward compatibility
    ];
    if (studentSkills.length > 0) {
      const studentSkillSet = new Set(studentSkills.map(s => s.toLowerCase().trim()));
      const activeInternships = await Internship.find({ status: "Active" }).select("coreSkills additionalSkills");
      skillMatches = activeInternships.filter(internship => {
        const allSkills = [
          ...(internship.coreSkills || []),
          ...(internship.additionalSkills || [])
        ];
        return allSkills.some(skill => studentSkillSet.has(skill.toLowerCase().trim()));
      }).length;
    }

    res.status(200).json({
      profileCompletion,
      totalApplications,
      shortlisted,
      skillMatches
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id }).select("preferences skills coreSkills additionalSkills");
    res.status(200).json({
      preferences: profile?.preferences || {},
      skills: profile?.skills || [],
      coreSkills: profile?.coreSkills || [],
      additionalSkills: profile?.additionalSkills || []
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch preferences", error: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { categories, workingMode, expectedSalary, preferredLocations } = req.body;
    const profile = await SeekerProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { "preferences.categories": categories, "preferences.workingMode": workingMode, "preferences.expectedSalary": expectedSalary, "preferences.preferredLocations": preferredLocations } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Preferences saved successfully", preferences: profile.preferences });
  } catch (error) {
    res.status(500).json({ message: "Failed to save preferences", error: error.message });
  }
};

// Career Assessment Quiz
exports.saveCareerQuiz = async (req, res) => {
  try {
    const { topCareer, topPercentage, allResults } = req.body;
    const profile = await SeekerProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          careerAssessment: {
            topCareer,
            topPercentage,
            allResults,
            takenAt: new Date(),
          },
        },
      },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Career assessment saved successfully", careerAssessment: profile.careerAssessment });
  } catch (error) {
    res.status(500).json({ message: "Failed to save career assessment", error: error.message });
  }
};

exports.getCareerQuiz = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id }).select("careerAssessment");
    res.status(200).json({ careerAssessment: profile?.careerAssessment || null });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch career assessment", error: error.message });
  }
};

exports.getRecentInternships = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id }).select("preferences careerAssessment");

    let categories = profile?.preferences?.categories || [];
    if (categories.length === 0 && profile?.careerAssessment?.topCareer) {
      categories = [profile.careerAssessment.topCareer];
    }

    const query = { status: "Active" };
    if (categories.length > 0) {
      query.category = { $in: categories };
    }

    const internships = await Internship.find(query)
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title company location mode category salaryMin salaryMax coreSkills additionalSkills createdAt");

    res.status(200).json({ internships });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent internships", error: error.message });
  }
};

exports.getTrendingSkills = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id }).select("preferences careerAssessment");

    let categories = profile?.preferences?.categories || [];
    if (categories.length === 0 && profile?.careerAssessment?.topCareer) {
      categories = [profile.careerAssessment.topCareer];
    }
    if (categories.length === 0) {
      return res.status(200).json({ skills: [] });
    }

    const internships = await Internship.find({ status: "Active", category: { $in: categories } }).select("coreSkills additionalSkills");

    const skillCounts = {};
    internships.forEach((job) => {
      [...(job.coreSkills || []), ...(job.additionalSkills || [])].forEach((skill) => {
        const key = skill.trim();
        if (key) skillCounts[key] = (skillCounts[key] || 0) + 1;
      });
    });

    const sorted = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.status(200).json({ skills: sorted });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trending skills", error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const userId = req.user.id;

    // Get student profile to delete certificate files
    const profile = await StudentProfile.findOne({ user: userId });
    if (profile) {
      // Delete certificate files
      if (profile.certificates && profile.certificates.length > 0) {
        profile.certificates.forEach((cert) => {
          if (cert.filePath) {
            const fullPath = path.join(__dirname, "..", cert.filePath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
          }
        });
      }
      // Delete CV file
      if (profile.cvFile?.filePath) {
        const cvPath = path.join(__dirname, "..", profile.cvFile.filePath);
        if (fs.existsSync(cvPath)) fs.unlinkSync(cvPath);
      }
      // Delete profile image
      if (profile.profileImage) {
        const imgPath = path.join(__dirname, "..", profile.profileImage);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
    }

    // Delete seeker profile
    await SeekerProfile.deleteOne({ user: userId });

    // Delete applications by this seeker
    await Application.deleteMany({ student: userId });

    // Delete conversations where user is a participant
    const conversations = await Conversation.find({ participants: userId }).select("_id");
    const conversationIds = conversations.map((c) => c._id);

    if (conversationIds.length > 0) {
      await Message.deleteMany({ conversation: { $in: conversationIds } });
      await Conversation.deleteMany({ participants: userId });
    }

    // Delete messages sent by user
    await Message.deleteMany({ sender: userId });

    // Delete notifications for user
    await Notification.deleteMany({ user: userId });

    // Delete user
    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Account deletion failed", error: error.message });
  }
};