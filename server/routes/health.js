const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Skills2Career API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

module.exports = router;