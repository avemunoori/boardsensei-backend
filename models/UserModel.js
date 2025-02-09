// models/UserModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Track user progress
    progress: {
      lessonsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
      quizzesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    },
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare plaintext password with hashed
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
