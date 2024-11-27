import express from "express";
import { getDailyQuestions, startedDailyQuiz } from "../controllers/questionsControllers.js";
import auth from "../middleware/auth.js";




const router = express.Router();
router.get("/daily-questions", auth, getDailyQuestions);
router.put("/start", auth, startedDailyQuiz);

export default router;
