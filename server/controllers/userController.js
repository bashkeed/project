import User from "../models/userModel.js";

export const getUserProfile = async (req, res) => {
  const id = req.userId;
  if (!id) return res.status(400).json({ error: "User ID is required" });

  try {
    const user = await User.findById(id).select("name");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ username: user.name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserScores = async (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const id = req.userId;
  if (!id) return res.status(400).json({ error: "User ID is required" });

  try {
    const user = await User.findById(id);
    // .select("scores");
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log(user);

    const cumulativeScore = user.scores.filter(
      (score) => score.correct === true
    ).length;
    console.log(cumulativeScore);

    const latestScore = user.scores.filter(
      (score) =>
        score.correct &&
        score.answeredAt &&
        new Date(score.answeredAt).toISOString().split("T")[0] === today
    ).length;

    res.json({ cumulativeScore, latestScore });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: { $ne: "admin" } }, "name totalScore")
      .sort({ totalScore: -1 })
      .limit(10)
      .exec();
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the leaderboard." });
  }
};


export const getScoreHistory = async (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  try {
    const latestScore = User.scores.filter(
      (score) =>
        score.correct &&
        score.answeredAt &&
        new Date(score.answeredAt).toISOString().split("T")[0] === today
    ).length;

    const date = await User.find(
      { role: { $ne: "admin" } },
      "date"
    )
      .sort({ date: -1 })
      .exec();
    res.json(date, latestScore);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the score history." });
  }
};