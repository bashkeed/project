import express from "express";
import auth from "../middleware/auth.js";
import {
  startedDailyQuiz,
  submitQuiz,
} from "../controllers/quizController.js";

const router = express.Router();
router.put("/start", auth, startedDailyQuiz);
router.put("/submit", auth, submitQuiz);
export default router;
