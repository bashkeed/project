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
    const user = await User.findById(id).populate({
      path: "dailyQuestions",
      select: "content options correctAnswer",
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    const excludedQuestions = user.completedQuestions || [];
    const dailyQuestions =  user.dailyQuestions
    
    const alreadyAnswered = dailyQuestions.some((question) =>
      excludedQuestions.includes(question._id)
    );

    if (alreadyAnswered) {
      return res.status(400).json({ error: "Some questions have already been answered" });
    }
  

    console.log(dailyQuestions);
    console.log(answers);
    let scores = dailyQuestions.map((question) => ({
      questionId: question._id,
      correct: question.correctAnswer === answers[question._id],
      answeredAt: Date.now(),
    }));
    
    let completedQuestions = dailyQuestions.map(
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



