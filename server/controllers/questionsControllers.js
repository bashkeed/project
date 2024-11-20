import Question from "../models/questionModel";
import User from "../models/userModel";
import { isSameDay } from "date-fns";

export const getDailyQuestions = async (req, res) => {
    try {
        const id = req.userId;
        if (!id) return res.status(400).json({ error: "User ID is required" });

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.dailyQuestions.length && isSameDay(user.lastDailyFetch, new Date())) {
            return res.json({ message: "Questions already fetched for today." });
        }

        const excludedQuestions = user.completedQuestions || [];
        const dailyQuestions = await Question.aggregate([
            { $match: { _id: { $nin: excludedQuestions } } },
            { $sample: { size: 10 } },
        ]);

        user.dailyQuestions = dailyQuestions.map(q => q._id);
        user.lastDailyFetch = new Date();
        await user.save();

        res.json(dailyQuestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching daily questions." });
    }
};
