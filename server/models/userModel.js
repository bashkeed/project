import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    default: "0",
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  completedQuestions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  ],
  dailyQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  lastDailyFetch: { type: Date },
  hasAnsweredDailyQuestions: { type: Boolean, default: false },
  totalScore: { type: Number, default: 0 },
  scores: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      correct: { type: Boolean, required: true },
      answeredAt: { type: Date, default: Date.now },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);
export default User;
