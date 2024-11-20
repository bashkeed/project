import express from "express";
import { getDailyQuestions } from "../controllers/questionsControllers";
import auth from "../middleware/auth";




const router = express.Router();


router.get("/daily-questions", auth, getDailyQuestions);

export default router;
