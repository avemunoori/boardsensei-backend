const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  openingName: { type: String, default: "Unnamed Quiz" },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }], 
      answer: { type: String, required: true },     
    },
  ],
}, { timestamps: true });
