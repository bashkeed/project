import express from "express";
import { getDailyQuestions } from "../controllers/questionsControllers.js";
import auth from "../middleware/auth.js";




const router = express.Router();


router.get("/daily-questions", auth, getDailyQuestions);

export default router;
