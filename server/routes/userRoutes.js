import express from "express";
import auth from "../middleware/auth.js";
import {getUserProfile,
        getUserScores,
        getLeaderboard} from '../controllers/userController.js'

  const router = express.Router();
  router.get("/user-profile", auth, getUserProfile);
  router.get("/user-scores", auth, getUserScores);
  router.get("/leaderboard", auth, getLeaderboard);

  export default router