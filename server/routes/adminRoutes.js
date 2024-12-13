import express from "express";
const router = express.Router();
import { getUsers } from "../controllers/adminController.js";
import { adminAuth } from "../middleware/auth.js";

// Route to get all users
router.get("/users", adminAuth, getUsers);
export default router;