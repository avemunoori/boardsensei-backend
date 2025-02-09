const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    openingName: { type: String, required: true }, 
    questions: [
      {
        question: { type: String, required: true },
        choices: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
