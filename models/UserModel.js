// models/UserModel.js
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    progress: {
      // Store arrays of completed lesson/quiz IDs
      lessonsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
      quizzesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    },
  },
  { timestamps: true },
)

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Password compare
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", userSchema)

