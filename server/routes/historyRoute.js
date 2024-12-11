import express from "express";
import fetchHistoryData from "../controllers/historyController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.get("/", auth, fetchHistoryData);

export default router;
