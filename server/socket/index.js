const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const onlineUsers = new Map(); // userId -> socketId

const setupSocket = (io) => {
  // Auth Middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select("-password");
      if (!socket.user) return next(new Error("User not found"));
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    socket.on("joinRoom", async (conversationId) => {
      const conv = await Conversation.findById(conversationId);
      if (conv && conv.participants.includes(userId)) {
        socket.join(`conv_${conversationId}`);
      }
    });

    socket.on("sendMessage", async ({ conversationId, text }) => {
      try {
        const conv = await Conversation.findById(conversationId);
        if (!conv || !conv.participants.includes(userId)) return;

        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          text
        });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: text,
          updatedAt: new Date()
        });

        io.to(`conv_${conversationId}`).emit("newMessage", message);
      } catch (err) {
        console.error("Socket send error:", err);
      }
    });

    socket.on("typing", ({ conversationId }) => {
      socket.to(`conv_${conversationId}`).emit("userTyping", { userId });
    });

    socket.on("stopTyping", ({ conversationId }) => {
      socket.to(`conv_${conversationId}`).emit("userStopTyping", { userId });
    });

    socket.on("markRead", async ({ conversationId }) => {
      await Message.updateMany(
        { conversation: conversationId, sender: { $ne: userId }, read: false },
        { read: true }
      );
      socket.to(`conv_${conversationId}`).emit("messagesRead", { userId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = setupSocket;