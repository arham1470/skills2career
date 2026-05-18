const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
    lastMessage: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
module.exports = mongoose.model("Conversation", conversationSchema);