const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    employer:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seeker:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internship:  { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    type:        { type: String, enum: ["walkin", "zoom"], required: true },
    date:        { type: String, required: true },
    time:        { type: String, required: true },
    address:     { type: String },
    zoomLink:    { type: String },
    notes:       { type: String },
    status:      { type: String, enum: ["Scheduled", "Cancelled", "Completed"], default: "Scheduled" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
