const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
const router = express.Router();

// Register User
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.status(201).json({ success: true, token, user: { id: user._id, name, email } });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Fetch User Progress
router.get("/users/progress/:id", async (req, res) => {
  try {
    console.log("Fetching progress for user ID:", req.params.id);

    const user = await User.findById(req.params.id).populate(
      "progress.lessonsCompleted progress.quizzesCompleted"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("User Progress:", user.progress);

    res.json({ success: true, progress: user.progress });
  } catch (error) {
    console.error("Error fetching user progress:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
