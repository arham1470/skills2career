const mongoose = require("mongoose");

const companyProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String, required: true, trim: true, default: "" },
    industry: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },
    website: { type: String, trim: true, default: "" },
    contactEmail: { type: String, trim: true, default: "" },
    contactPhone: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    logo: { type: String, default: "" },
    verified: { type: Boolean, default: false }, // For admin verification later
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompanyProfile", companyProfileSchema);