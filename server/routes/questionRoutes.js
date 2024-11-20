import express from "express";
import { getDailyQuestions } from "../controllers/questionsControllers";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/",auth, getDailyQuestions);
router.post("/signup", signup);

export default router;
