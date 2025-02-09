// routes/quizzes.js
const express = require("express");
const router = express.Router();
const Quiz = require("../models/QuizModel");
const User = require("../models/UserModel");
const { protect } = require("../middleware/authMiddleware");

// GET all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("lesson", "name description");
    res.json({ success: true, data: quizzes });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("lesson", "name description");
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.json({ success: true, data: quiz });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// SUBMIT quiz => update user progress
router.post("/:id/submit", protect, async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.answer === answers[index]) {
        score++;
      }
    });

    // Update progress
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { "progress.quizzesCompleted": quiz._id } },
      { new: true }
    );

    res.json({ success: true, score, message: "Quiz submitted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
