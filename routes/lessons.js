// routes/lessons.js
const express = require("express");
const router = express.Router();
const Lesson = require("../models/LessonModel");
const User = require("../models/UserModel");
const { protect } = require("../middleware/authMiddleware");

// GET all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json({ success: true, data: lessons });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET a specific lesson
router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }
    res.json({ success: true, data: lesson });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// COMPLETE a lesson - update user progress
router.post("/:id/complete", protect, async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    // user is attached to req by protect middleware (req.user)
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { "progress.lessonsCompleted": lesson._id } },
      { new: true }
    );

    res.json({
      success: true,
      message: `Lesson "${lesson.name}" marked as completed.`,
      lessonId: lesson._id,
    });
  } catch (error) {
    console.error("Error completing lesson:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
