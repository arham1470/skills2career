const mongoose = require("mongoose");

const seekerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    profileImage: { type: String, default: "" },
    
    // Resume Fields
    profileTitle: { type: String, default: "" },
    summary: { type: String, default: "" },
    availability: { type: String, enum: ["Immediate", "1 Week", "1 Month", "3 Months"], default: "Immediate" },
    interests: [{ type: String }],
    skills: [{ type: String }],
    coreSkills: [{ type: String }],
    additionalSkills: [{ type: String }],
    languages: [{ language: { type: String }, level: { type: String, enum: ["Basic", "Intermediate", "Fluent", "Native"], default: "Intermediate" } }],
    education: [{ institution: String, qualificationLevel: String, description: String, startDate: String, endDate: String, current: Boolean }],
    experience: [{ company: String, role: String, description: String, startDate: String, endDate: String, current: Boolean }],
    projects: [{ title: String, description: String, technologies: String, link: String, startDate: String, endDate: String, current: Boolean }],
    references: [{ name: String, relationship: String, company: String, email: String, phone: String }],

    // Preferences (NEW)
    preferences: {
      categories: [{ type: String }],
      workingMode: [{ type: String, enum: ["On-site", "Remote", "Hybrid"] }],
      expectedSalary: { type: String, default: "" },
      preferredLocations: [{ type: String }]
    },

    // Certificates
    certificates: [{ name: String, description: String, issuedDate: String, fileName: String, filePath: String }],

    // CV
    cvFile: { fileName: { type: String, default: "" }, filePath: { type: String, default: "" }, uploadedAt: { type: Date } },

    // Career Assessment Quiz Result
    careerAssessment: {
      topCareer: { type: String, default: "" },
      topPercentage: { type: Number, default: 0 },
      allResults: [
        {
          career: { type: String },
          percentage: { type: Number },
          skills: [{ type: String }],
          internships: [{ type: String }],
        }
      ],
      takenAt: { type: Date },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SeekerProfile", seekerProfileSchema);