// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

// Protected Route Example
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Profile accessed successfully",
    user: req.user
  });
});

module.exports = router;