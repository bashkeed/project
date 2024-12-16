import express from "express";
const router = express.Router();
import { getUsers } from "../controllers/adminController.js";
import { adminAuth } from "../middleware/auth.js";
import { createQuestion } from "../controllers/questionsControllers.js";

// Route to get all users
router.get("/users", adminAuth, getUsers);
// Route to upload daily questions
router.post("/question", adminAuth, createQuestion);
export default router;
