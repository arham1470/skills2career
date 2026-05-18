const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getConversations, getMessages, initiateConversation, deleteConversation } = require("../controllers/chatController");

router.use(verifyToken);
router.get("/conversations", getConversations);
router.get("/messages/:convId", getMessages);
router.post("/initiate", initiateConversation);
router.delete("/conversation/:convId", deleteConversation);

module.exports = router;