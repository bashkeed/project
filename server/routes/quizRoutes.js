import express from "express";
import auth from "../middleware/auth.js";
import {
  startedDailyQuiz,
  submitQuiz,
  getUserProfile,
  getUserScores,
  getLeaderboard
} from "../controllers/quizController.js";

const router = express.Router();
router.put("/start", auth, startedDailyQuiz);
router.put("/submit", auth, submitQuiz);
router.get("/user-profile",auth, getUserProfile);
router.get("/user-scores",auth, getUserScores);
router.get("/leaderboard",auth, getLeaderboard);
export default router;
