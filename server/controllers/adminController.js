const User = require("../models/User");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const SeekerProfile = require("../models/SeekerProfile");
const CompanyProfile = require("../models/CompanyProfile");

exports.getStats = async (req, res) => {
  try {
    const totalSeekers = await User.countDocuments({ role: "seeker" });
    const totalEmployers = await User.countDocuments({ role: "employer" });
    const totalInternships = await Internship.countDocuments();
    const activeInternships = await Internship.countDocuments({ status: "Active" });
    const draftInternships = await Internship.countDocuments({ status: "Draft" });
    const closedInternships = await Internship.countDocuments({ status: "Closed" });
    const rejectedInternships = await Internship.countDocuments({ status: "Rejected" });
    const totalApplications = await Application.countDocuments();
    const suspendedUsers = await User.countDocuments({ isSuspended: true });

    res.status(200).json({
      stats: { totalSeekers, totalEmployers, totalInternships, activeInternships, draftInternships, closedInternships, rejectedInternships, totalApplications, suspendedUsers }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = { role: role || { $in: ["seeker", "employer"] } };
    if (search) query.email = { $regex: search, $options: "i" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);

    res.status(200).json({ users, pagination: { page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), total } });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

exports.toggleUserSuspension = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot suspend admin" });

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({ message: `User ${user.isSuspended ? "suspended" : "activated"}`, user });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

exports.getInternships = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status && status !== "All") query.status = status;
    if (search) query.$or = [{ title: { $regex: search, $options: "i" } }, { company: { $regex: search, $options: "i" } }];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const internships = await Internship.find(query)
      .populate("postedBy", "email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Internship.countDocuments(query);

    res.status(200).json({ internships, pagination: { page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), total } });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch internships", error: error.message });
  }
};

exports.updateInternshipStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Closed", "Draft", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const internship = await Internship.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!internship) return res.status(404).json({ message: "Internship not found" });

    res.status(200).json({ message: `Internship status updated to ${status}`, internship });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// Dev-only: Create first admin account
exports.seedAdmin = async (req, res) => {
  try {
    const exists = await User.findOne({ role: "admin" });
    if (exists) return res.status(200).json({ message: "Admin already exists" });

    const admin = await User.create({
      email: "admin@skills2career.lk",
      password: "Admin@123",
      role: "admin",
      isVerified: true
    });

    res.status(200).json({ message: "Admin created", email: admin.email, password: "Admin@123" });
  } catch (error) {
    res.status(500).json({ message: "Seed failed", error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password", error: error.message });
  }
};

// Helper to calculate profile completion (same logic as companyController)
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

exports.getPendingCompanies = async (req, res) => {
  try {
    const companies = await CompanyProfile.find({ verified: false })
      .populate("user", "email createdAt")
      .sort({ createdAt: -1 });

    const pending = companies
      .map(c => ({
        ...c.toObject(),
        completion: calculateProfileCompletion(c)
      }))
      .filter(c => c.completion === 100);

    res.status(200).json({ companies: pending });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending companies", error: error.message });
  }
};

exports.verifyCompany = async (req, res) => {
  try {
    const company = await CompanyProfile.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ message: "Company verified successfully", company });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

exports.unverifyCompany = async (req, res) => {
  try {
    const company = await CompanyProfile.findByIdAndUpdate(
      req.params.id,
      { verified: false },
      { new: true }
    );
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ message: "Company unverified", company });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    // Delete admin account
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account", error: error.message });
  }
};