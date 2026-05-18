const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Pending", "Shortlisted", "Selected", "Rejected"], default: "Pending" },
    cvPath: { type: String }, // Snapshot of CV at time of application
    appliedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ internship: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);