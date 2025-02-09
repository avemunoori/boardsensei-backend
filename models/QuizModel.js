// models/QuizModel.js
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    // Title for the quiz (like "Sicilian Defense")
    openingName: { type: String, default: "Unnamed Quiz" },

    // If you want to reference a Lesson
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },

    // Array of questions
    questions: [
      {
        // The question text
        question: { type: String, required: true },
        // The multiple-choice options
        options: [{ type: String, required: true }],
        // The correct answer as a string
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Export a Mongoose model named "Quiz"
module.exports = mongoose.model("Quiz", quizSchema);
