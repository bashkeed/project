// server/models/Quiz.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  scores: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: { type: Number },
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
