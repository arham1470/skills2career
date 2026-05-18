const Interview = require("../models/Interview");
const Application = require("../models/Application");
const SeekerProfile = require("../models/SeekerProfile");
const Notification = require("../models/Notification");

// EMPLOYER: Schedule an interview for a shortlisted candidate
exports.createInterview = async (req, res) => {
  try {
    const { applicationId, type, date, time, address, zoomLink, notes } = req.body;

    const application = await Application.findById(applicationId)
      .populate("internship", "title postedBy _id")
      .populate("student", "_id email");

    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.internship.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (application.status !== "Shortlisted")
      return res.status(400).json({ message: "Can only schedule interviews for shortlisted candidates" });

    const existing = await Interview.findOne({ application: applicationId, status: "Scheduled" });
    if (existing)
      return res.status(400).json({ message: "An active interview is already scheduled for this candidate" });

    const interview = await Interview.create({
      application: applicationId,
      employer: req.user.id,
      seeker: application.student._id,
      internship: application.internship._id,
      type,
      date,
      time,
      address: type === "walkin" ? address : undefined,
      zoomLink: type === "zoom" ? zoomLink : undefined,
      notes,
    });

    await Notification.create({
      user: application.student._id,
      message: `Your interview for "${application.internship.title}" has been scheduled on ${date} at ${time}`,
      type: "success",
      link: "/seeker/applications",
    });

    res.status(201).json({ message: "Interview scheduled successfully", interview });
  } catch (error) {
    res.status(500).json({ message: "Failed to schedule interview", error: error.message });
  }
};

// EMPLOYER: Get all interviews they've scheduled
exports.getEmployerInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ employer: req.user.id })
      .populate("internship", "title company")
      .populate("seeker", "email")
      .populate("application", "status")
      .sort({ date: 1, time: 1 });

    const enriched = await Promise.all(
      interviews.map(async (iv) => {
        const profile = await SeekerProfile.findOne({ user: iv.seeker._id }).select("fullName profileImage");
        return {
          ...iv.toObject(),
          seekerName: profile?.fullName || iv.seeker?.email,
          seekerImage: profile?.profileImage || null,
        };
      })
    );

    res.status(200).json({ interviews: enriched });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch interviews", error: error.message });
  }
};

// SEEKER: Get interviews scheduled for them
exports.getSeekerInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ seeker: req.user.id })
      .populate("internship", "title company")
      .sort({ date: 1, time: 1 });

    res.status(200).json({ interviews });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch interviews", error: error.message });
  }
};

// EMPLOYER: Update interview status (Completed / Cancelled)
exports.updateInterview = async (req, res) => {
  try {
    const { status } = req.body;

    const interview = await Interview.findOne({ _id: req.params.id, employer: req.user.id })
      .populate("internship", "title");

    if (!interview) return res.status(404).json({ message: "Interview not found" });

    interview.status = status;
    await interview.save();

    if (status === "Cancelled") {
      await Notification.create({
        user: interview.seeker,
        message: `Your interview for "${interview.internship.title}" has been cancelled`,
        type: "warning",
        link: "/seeker/applications",
      });
    }

    res.status(200).json({ message: `Interview marked as ${status}`, interview });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};
