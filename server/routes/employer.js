const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const { updatePassword, deleteAccount } = require("../controllers/employerController");

// All routes require employer authentication
router.use(verifyToken, requireRole("employer"));

router.put("/password", updatePassword);
router.delete("/account", deleteAccount);

module.exports = router;