const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    openingName: { type: String}, 
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
