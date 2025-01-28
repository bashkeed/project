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
  const id = req.userId; // Assuming the user ID is passed in the request
  if (!id) return res.status(400).json({ error: "User ID is required" });

  try {
    // Fetch the user's scores
    const user = await User.findById(id, "scores").exec();

    if (!user || !user.scores) {
      return res
        .status(404)
        .json({ error: "User not found or no scores available." });
    }

    // Group scores by date and calculate total score for each day
    const scoreMap = {};

    user.scores.forEach((score) => {
      if (score.answeredAt && score.correct) {
        const date = new Date(score.answeredAt).toISOString().split("T")[0]; // Get date in YYYY-MM-DD format
        if (!scoreMap[date]) {
          scoreMap[date] = 0; // Initialize score for the date
        }
        scoreMap[date] += 1; // Increment total score for that date
      }
    });

    // Convert the score map into an array of objects
    const scoreHistory = Object.entries(scoreMap)
      .map(([date, totalScore]) => ({
        date,
        totalScore,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date in descending order

    // Send the response
    res.json(scoreHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching the score history.",
    });
  }
};
