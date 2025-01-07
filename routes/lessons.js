const express = require("express");
const Lesson = require("../models/LessonModel");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Fetch all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json({ success: true, data: lessons });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Fetch specific lesson by ID
router.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }
    res.json({ success: true, data: lesson });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Create a new lesson
router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("description").not().isEmpty().withMessage("Description is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, description, steps } = req.body;
      const lesson = new Lesson({ name, description, steps });
      await lesson.save();
      res.status(201).json({ success: true, data: lesson });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

module.exports = router;
