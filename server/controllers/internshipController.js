const Internship = require("../models/Internship");
const SeekerProfile = require("../models/SeekerProfile");
const CompanyProfile = require("../models/CompanyProfile");

// --- SEEKER / PUBLIC ENDPOINTS ---

const calculateSingleMatch = (seekerSkills, targetSkills) => {
  if (!targetSkills || targetSkills.length === 0) return 0;
  const seekerSet = new Set(seekerSkills.map(s => s.toLowerCase().trim()));
  const matchCount = targetSkills.filter(skill => seekerSet.has(skill.toLowerCase().trim())).length;
  return Math.round((matchCount / targetSkills.length) * 100);
};

// Weighted matching: seeker core vs company core (75%), seeker additional vs company additional (25%)
const calculateMatch = (seekerCoreSkills, seekerAdditionalSkills, companyCoreSkills, companyAdditionalSkills) => {
  const coreMatch = calculateSingleMatch(seekerCoreSkills || [], companyCoreSkills);
  const addMatch = calculateSingleMatch(seekerAdditionalSkills || [], companyAdditionalSkills);
  // If company has no additional skills, weight shifts to 100% core
  if (!companyAdditionalSkills || companyAdditionalSkills.length === 0) {
    return coreMatch;
  }
  return Math.round((coreMatch * 0.75) + (addMatch * 0.25));
};

exports.getRecommended = async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user: req.user.id }).select("skills coreSkills additionalSkills preferences");
    if (!profile) return res.status(404).json({ message: "Complete your profile first" });

    // Use new categorized skills if available, fallback to legacy skills array
    const seekerCoreSkills = profile.coreSkills?.length ? profile.coreSkills : (profile.skills || []);
    const seekerAdditionalSkills = profile.additionalSkills || [];
    const prefs = profile.preferences || {};

    const query = { status: "Active" };
    if (prefs.categories?.length) query.category = { $in: prefs.categories };
    if (prefs.workingMode?.length) query.mode = { $in: prefs.workingMode };
    if (prefs.preferredLocations?.length) query.location = { $in: prefs.preferredLocations };

    const internships = await Internship.find(query).lean();
    const matched = internships.map(internship => ({
      ...internship,
      matchPercentage: calculateMatch(seekerCoreSkills, seekerAdditionalSkills, internship.coreSkills, internship.additionalSkills)
    }));

    matched.sort((a, b) => b.matchPercentage - a.matchPercentage);
    res.status(200).json({ internships: matched.filter(i => i.matchPercentage >= 50) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recommendations", error: error.message });
  }
};

exports.seedInternships = async (req, res) => {
  try {
    const count = await Internship.countDocuments();
    if (count > 0) return res.status(200).json({ message: "Database already seeded" });

    const samples = [
      { title: "Frontend Developer Intern", company: "TechNova", category: "Technology & IT", location: "Colombo", mode: "Remote", salaryMin: 30000, salaryMax: 50000, coreSkills: ["React", "JavaScript", "Git"], additionalSkills: ["Tailwind CSS", "TypeScript", "Figma"], description: "Build modern UIs for our SaaS platform.", status: "Active", postedBy: req.user?.id || new mongoose.Types.ObjectId() },
      { title: "Marketing Assistant", company: "BrandLanka", category: "Marketing & Communications", location: "Kandy", mode: "On-site", salaryMin: 25000, salaryMax: 40000, coreSkills: ["Social Media", "Content Writing"], additionalSkills: ["Canva", "Analytics", "SEO"], description: "Assist in campaign execution and content creation.", status: "Active", postedBy: req.user?.id || new mongoose.Types.ObjectId() },
      { title: "Finance Intern", company: "Global Bank PLC", category: "Finance & Accounting", location: "Colombo", mode: "Hybrid", salaryMin: 35000, salaryMax: 45000, coreSkills: ["Excel", "Accounting", "Financial Analysis"], additionalSkills: ["Reporting", "Power BI", "SQL"], description: "Support finance team with reporting and analysis.", status: "Active", postedBy: req.user?.id || new mongoose.Types.ObjectId() }
    ];

    await Internship.insertMany(samples);
    res.status(200).json({ message: "Successfully seeded internships" });
  } catch (error) {
    res.status(500).json({ message: "Seeding failed", error: error.message });
  }
};

// --- EMPLOYER ENDPOINTS ---

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

exports.createInternship = async (req, res) => {
  try {
    const company = await CompanyProfile.findOne({ user: req.user.id });
    const completion = calculateProfileCompletion(company);

    if (completion < 100) {
      return res.status(403).json({
        message: `Your company profile is ${completion}% complete. Please complete it to 100% before posting internships.`,
        completion
      });
    }

    if (!company.verified) {
      return res.status(403).json({
        message: "Your account is pending admin verification. Please wait for approval before posting internships.",
        verified: false
      });
    }

    const companyName = company?.companyName || "Your Company";

    const internship = await Internship.create({
      ...req.body,
      company: companyName,
      postedBy: req.user.id
    });

    res.status(201).json({ message: "Internship created successfully", internship });
  } catch (error) {
    res.status(500).json({ message: "Failed to create internship", error: error.message });
  }
};

exports.getProviderInternships = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { postedBy: req.user.id };
    if (status && status !== "All") query.status = status;

    const internships = await Internship.find(query).sort({ createdAt: -1 });
    res.status(200).json({ internships });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch internships", error: error.message });
  }
};

exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!internship) return res.status(404).json({ message: "Internship not found" });
    res.status(200).json({ message: "Internship updated", internship });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
    if (!internship) return res.status(404).json({ message: "Internship not found" });
    res.status(200).json({ message: "Internship deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Closed", "Draft"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const internship = await Internship.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      { status },
      { new: true }
    );
    if (!internship) return res.status(404).json({ message: "Internship not found" });
    res.status(200).json({ message: `Status changed to ${status}`, internship });
  } catch (error) {
    res.status(500).json({ message: "Status update failed", error: error.message });
  }
};

// ... keep existing imports and functions ...

// Add this to exports or inside the file
exports.browseInternships = async (req, res) => {
  try {
    const { search, category, location, mode, page = 1, limit = 9 } = req.query;
    const query = { status: "Active" };

    // Search Logic
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { title: regex },
        { company: regex },
        { description: regex },
        { coreSkills: regex },
        { additionalSkills: regex }
      ];
    }

    // Filters
    if (category) query.category = category;
    if (location) query.location = location;
    if (mode) query.mode = mode;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Internship.countDocuments(query);
    
    // Fetch Internships
    let internships = await Internship.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Skill Matching (Only if student is logged in)
    if (req.user && req.user.role === "seeker") {
      const seekerProfile = await SeekerProfile.findOne({ user: req.user.id }).select("skills coreSkills additionalSkills");
      const seekerCoreSkills = seekerProfile?.coreSkills?.length ? seekerProfile.coreSkills : (seekerProfile?.skills || []);
      const seekerAdditionalSkills = seekerProfile?.additionalSkills || [];
      if (seekerCoreSkills.length > 0 || seekerAdditionalSkills.length > 0) {
        internships = internships.map(job => ({
          ...job,
          matchPercentage: calculateMatch(seekerCoreSkills, seekerAdditionalSkills, job.coreSkills, job.additionalSkills)
        }));
        // Optional: Sort by match percentage descending
        internships.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
      }
    }

    res.status(200).json({
      internships,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to browse internships", error: error.message });
  }
};