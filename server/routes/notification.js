const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getNotifications, markRead, markAllRead } = require("../controllers/notificationController");

router.get("/", verifyToken, getNotifications);
router.patch("/:id/read", verifyToken, markRead);
router.patch("/read-all", verifyToken, markAllRead);

module.exports = router;