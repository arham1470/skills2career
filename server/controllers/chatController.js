const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Application = require("../models/Application");
const SeekerProfile = require("../models/SeekerProfile");
const CompanyProfile = require("../models/CompanyProfile");

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ 
      participants: req.user.id,
      deletedBy: { $ne: req.user.id }
    })
      .populate("participants", "email role")
      .populate("internship", "title company")
      .sort({ updatedAt: -1 });

    // Collect all unique participant IDs
    const userIds = [
      ...new Set(
        conversations.flatMap((c) => c.participants.map((p) => p._id.toString()))
      ),
    ];

    // Fetch profile names and avatars in parallel
    const [seekerProfiles, companyProfiles] = await Promise.all([
      SeekerProfile.find({ user: { $in: userIds } }).select("user fullName profileImage"),
      CompanyProfile.find({ user: { $in: userIds } }).select("user companyName logo"),
    ]);

    // Build lookup map: userId -> { name, avatar }
    const profileMap = {};
    seekerProfiles.forEach((sp) => {
      profileMap[sp.user.toString()] = { name: sp.fullName, avatar: sp.profileImage };
    });
    companyProfiles.forEach((cp) => {
      profileMap[cp.user.toString()] = { name: cp.companyName, avatar: cp.logo };
    });

    // Attach display names and avatars to participants before sending
    const enrichedConversations = conversations.map((conv) => {
      const convObj = conv.toObject();
      convObj.participants = convObj.participants.map((p) => {
        const profile = profileMap[p._id.toString()];
        return {
          ...p,
          name: profile?.name || p.email,
          avatar: profile?.avatar || "",
        };
      });
      return convObj;
    });

    res.status(200).json({ conversations: enrichedConversations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversations", error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { convId } = req.params;
    const conv = await Conversation.findById(convId);
    if (!conv || !conv.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const messages = await Message.find({ conversation: convId }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};

exports.initiateConversation = async (req, res) => {
  try {
    const { seekerId, internshipId } = req.body;

    // If internshipId is provided, verify application exists (backward compatible)
    if (internshipId) {
      const app = await Application.findOne({ student: seekerId, internship: internshipId });
      if (!app) return res.status(403).json({ message: "No application found for this seeker & internship" });
    }

    // Find or create conversation
    let conv = await Conversation.findOne({
      participants: { $all: [req.user.id, seekerId] },
      ...(internshipId ? { internship: internshipId } : {})
    });

    if (!conv) {
      conv = await Conversation.create({
        participants: [req.user.id, seekerId],
        internship: internshipId || null
      });
    }

    res.status(200).json({ conversation: conv });
  } catch (error) {
    res.status(500).json({ message: "Failed to initiate chat", error: error.message });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const { convId } = req.params;
    const { deleteForBoth } = req.body;

    const conv = await Conversation.findById(convId);
    if (!conv) return res.status(404).json({ message: "Conversation not found" });

    // Check if user is a participant
    if (!conv.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // If employer confirms to delete for both, hard delete
    if (deleteForBoth && req.user.role === "employer") {
      await Message.deleteMany({ conversation: convId });
      await Conversation.findByIdAndDelete(convId);
      return res.status(200).json({ message: "Conversation deleted completely" });
    }

    // Soft delete: add user to deletedBy array
    if (!conv.deletedBy.includes(req.user.id)) {
      conv.deletedBy.push(req.user.id);
      await conv.save();
    }

    // If both users have deleted, hard delete
    if (conv.deletedBy.length === conv.participants.length) {
      await Message.deleteMany({ conversation: convId });
      await Conversation.findByIdAndDelete(convId);
      return res.status(200).json({ message: "Conversation deleted completely" });
    }

    res.status(200).json({ message: "Conversation deleted for you" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete conversation", error: error.message });
  }
};