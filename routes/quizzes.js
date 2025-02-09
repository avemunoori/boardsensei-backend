const express = require("express");
const router = express.Router();

// Make sure this path and filename exactly match your model file
const Quiz = require("../models/QuizModel");

// Fetch all quizzes
router.get("/", async (req, res) => {
  try {
    // Now that the model is correct, Quiz.find() and populate() should work
    const quizzes = await Quiz.find().populate("lesson", "name description");
    res.json({ success: true, data: quizzes });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Fetch a specific quiz by ID
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

// Submit quiz answers
router.post("/:id/submit", async (req, res) => {
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

    res.json({ success: true, score, message: "Quiz submitted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
