// models/QuizModel.js
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    // optional lesson reference
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    openingName: { type: String, default: "Unnamed Quiz" },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
