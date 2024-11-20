import Question from "../models/questionModel"
import User from "../models/userModel"

export const getDailyQuestions = async(req, res)=>{
    const id = req.userId
    const user = await User.findById(id)

    if (user.dailyQuestions.length && isSameDay(user.lastDailyFetch, new Date())) {
        return res.json({message:""})
    }
    
    const excludedQuestions= user.completedQuestions || []
    const dailyQuestions = await Question.aggregate([
        {$match:{_id: {$nin:excludedQuestions}}},
        {$sample:{size:10}}
    ])
    
    user.dailyQuestions = dailyQuestions.map(q=>q._id);
    user.lastDailyFetch = new Date();
    await user.save();
    res.json(dailyQuestions)
}