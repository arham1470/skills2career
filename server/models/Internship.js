const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    mode: { type: String, enum: ["On-site", "Remote", "Hybrid"], required: true },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    coreSkills: [{ type: String, trim: true }],
    additionalSkills: [{ type: String, trim: true }],
    description: { type: String, required: true },
    responsibilities: { type: String, trim: true },
    deadline: { type: Date },
    status: { type: String, enum: ["Active", "Closed", "Draft"], default: "Draft" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

internshipSchema.index({ status: 1, category: 1, location: 1 });
module.exports = mongoose.model("Internship", internshipSchema);