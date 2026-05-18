const User = require("../models/User");
const CompanyProfile = require("../models/CompanyProfile");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Notification = require("../models/Notification");

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
    if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password update failed", error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const userId = req.user.id;

    // Delete company profile
    await CompanyProfile.deleteOne({ user: userId });

    // Find internships posted by this employer
    const internships = await Internship.find({ postedBy: userId }).select("_id");
    const internshipIds = internships.map((i) => i._id);

    // Delete applications for those internships
    if (internshipIds.length > 0) {
      await Application.deleteMany({ internship: { $in: internshipIds } });
    }

    // Delete internships
    await Internship.deleteMany({ postedBy: userId });

    // Delete conversations where user is a participant
    const conversations = await Conversation.find({ participants: userId }).select("_id");
    const conversationIds = conversations.map((c) => c._id);

    if (conversationIds.length > 0) {
      await Message.deleteMany({ conversation: { $in: conversationIds } });
      await Conversation.deleteMany({ participants: userId });
    }

    // Delete messages sent by user (in case of any remaining)
    await Message.deleteMany({ sender: userId });

    // Delete notifications for user
    await Notification.deleteMany({ user: userId });

    // Delete user
    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Account deletion failed", error: error.message });
  }
};