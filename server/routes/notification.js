const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getNotifications, markRead } = require("../controllers/notificationController");

router.get("/", verifyToken, getNotifications);
router.patch("/:id/read", verifyToken, markRead);

module.exports = router;