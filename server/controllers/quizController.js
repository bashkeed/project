import User from "../models/userModel.js";

export const startedDailyQuiz = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) return res.status(400).json({ error: "User ID is required" });

    const user = await User.findById(id);

    user.hasAnsweredDailyQuestions = true;
    await user.save();
    res.json({ message: "Daily quiz started successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while starting daily quiz." });
  }
};

export const submitQuiz = async (req, res) => {
  const answers = req.body;
  console.log(req.body);

  const id = req.userId;
  if (!id) return res.status(400).json({ error: "User ID is required" });
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const dailyQuestions = await user.populate({
      path: "dailyQuestions",
      select: "content options correctAnswer",
    });

    console.log(dailyQuestions.dailyQuestions);
    console.log(answers);
    let scores = dailyQuestions.dailyQuestions.map((question) => ({
      questionId: question._id,
      correct: question.correctAnswer === answers[question._id],
      answeredAt: Date.now(),
    }));
    let completedQuestions = dailyQuestions.dailyQuestions.map(
      (question) => question._id
    );
    user.scores = [...user.scores, ...scores];
    user.totalScore = user.scores.filter((i) => i.correct === true).length;
    user.completedQuestions = [
      ...user.completedQuestions,
      ...completedQuestions,
    ];

    await user.save();
    res.json({ message: "Submitted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server Error" });
  }
};


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
  const id = req.userId;
  if (!id) return res.status(400).json({ error: "User ID is required" });

  try {
    const user = await User.findById(id).select("scores");
    if (!user) return res.status(404).json({ error: "User not found" });

    const cumulativeScore = user.scores.filter((score) => score.correct).length;
    const latestScore = user.scores.filter((score) => score.correct).length;

    res.json({ cumulativeScore, latestScore });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};




export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({}, 'name totalScore')
      .sort({ totalScore: -1 })
      .limit(10)
      .exec();
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the leaderboard." });
  }
};
