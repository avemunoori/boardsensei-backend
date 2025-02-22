// models/LessonModel.js
const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    steps: [
      {
        move: { type: String, required: true },
        explanation: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
)

module.exports = mongoose.model("Lesson", lessonSchema)

