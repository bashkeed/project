import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  completedQuestions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  ],
  dailyQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  lastDailyFetch: { type: Date },
  quizStartTime: { type: Date },
  totalScore: { type: Number, default: 0 },
  scores: [
    {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        correct: { type: Boolean, required: true },
        answeredAt: { type: Date, default: Date.now },
    },
],

});
const User = mongoose.model("User", userSchema);
export default User;
