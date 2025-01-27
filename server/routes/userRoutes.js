import express from "express";
import auth from "../middleware/auth.js";
import {
  getUserProfile,
  getUserScores,
  getLeaderboard,
  getScoreHistory,
} from "../controllers/userController.js";

  const router = express.Router();
  router.get("/user-profile", auth, getUserProfile);
  router.get("/user-scores", auth, getUserScores);
  router.get("/leaderboard", auth, getLeaderboard);
  router.get("/score-history", auth, getScoreHistory);


  export default router