
import Question from "../models/questionModel.js";
import User from "../models/userModel.js";
import { isSameDay } from "date-fns";

export const getDailyQuestions = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) return res.status(400).json({ error: "User ID is required" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if the user has fetched and answered the daily questions today
    if (
      user.dailyQuestions.length &&
      isSameDay(user.lastDailyFetch, new Date()) 
    ) {
      if(
        user.hasAnsweredDailyQuestions){

          return res.status(400).json({
            message: "Questions already fetched and answered for today.",
          });
        }
        else{
          const dailyQuestions = await user.populate({
            path: 'dailyQuestions',
            select: 'content options correctAnswer',
          }) 
          return res.json(dailyQuestions.dailyQuestions);
        }
    }

    // Fetch new set of daily questions
    const excludedQuestions = user.completedQuestions || [];
    const dailyQuestions = await Question.aggregate([
      { $match: { _id: { $nin: excludedQuestions } } },
      { $sample: { size: 10 } },
    ]);

    // Update user with new daily questions and timestamp
    user.dailyQuestions = dailyQuestions.map((q) => q._id);
    user.lastDailyFetch = new Date();
    user.hasAnsweredDailyQuestions = false; // Reset the flag for the new day
    await user.save();

    // Return the daily questions
    res.json(dailyQuestions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching daily questions." });
  }
};

export const startedDailyQuiz = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) return res.status(400).json({ error: "User ID is required" });

    const user = await User.findById(id)

    user.hasAnsweredDailyQuestions = true;
    await user.save();
    res.json({ message: "Daily quiz started successfully." });
  }
  catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while starting daily quiz." });
  }
}