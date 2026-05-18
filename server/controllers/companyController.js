const CompanyProfile = require("../models/CompanyProfile");
const Internship = require("../models/Internship");
const Application = require("../models/Application");

exports.getProfile = async (req, res) => {
  try {
    let profile = await CompanyProfile.findOne({ user: req.user.id });
    if (!profile) {
      // Auto-create profile if it doesn't exist
      profile = await CompanyProfile.create({ user: req.user.id, companyName: "New Company" });
    }
    res.status(200).json({ profile, email: req.user.email, verified: profile?.verified ?? false });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch company profile", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const existing = await CompanyProfile.findOne({ user: req.user.id });
    const completion = calculateProfileCompletion(existing);

    if (existing && completion === 100 && !existing.verified) {
      return res.status(403).json({
        message: "Your profile is complete and pending admin review. Editing is locked until verified."
      });
    }

    const updateData = req.body;
    const profile = await CompanyProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ message: "Company profile updated", profile });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const existing = await CompanyProfile.findOne({ user: req.user.id });
    const completion = calculateProfileCompletion(existing);

    if (existing && completion === 100 && !existing.verified) {
      return res.status(403).json({
        message: "Your profile is complete and pending admin review. Logo upload is locked until verified."
      });
    }

    const logoUrl = `/uploads/companies/${req.file.filename}`;
    await CompanyProfile.findOneAndUpdate({ user: req.user.id }, { logo: logoUrl }, { upsert: true });
    res.status(200).json({ message: "Logo uploaded successfully", logoUrl });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  const fields = [
    !!profile.companyName,
    !!profile.industry,
    !!profile.description,
    !!profile.website,
    !!profile.contactEmail,
    !!profile.contactPhone,
    !!profile.location,
    !!profile.logo
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

exports.getDashboardStats = async (req, res) => {
  try {
    const employerId = req.user.id;

    const profile = await CompanyProfile.findOne({ user: employerId });
    const profileCompletion = calculateProfileCompletion(profile);

    // Find all internships posted by this employer
    const employerInternships = await Internship.find({ postedBy: employerId }).select("_id status");
    const internshipIds = employerInternships.map(i => i._id);
    const activeInternships = employerInternships.filter(i => i.status === "Active").length;
    const totalInternships = employerInternships.length;

    // Total applications for employer's internships
    const totalApplications = internshipIds.length > 0
      ? await Application.countDocuments({ internship: { $in: internshipIds } })
      : 0;

    // Shortlisted + Selected
    const shortlisted = internshipIds.length > 0
      ? await Application.countDocuments({
          internship: { $in: internshipIds },
          status: { $in: ["Shortlisted", "Selected"] }
        })
      : 0;

    res.status(200).json({
      profileCompletion,
      verified: profile?.verified ?? false,
      activeInternships,
      totalApplications,
      shortlisted,
      totalInternships
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};