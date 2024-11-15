// server/routes/quiz.js
import express from 'express'
import User from './userModel';
import Quiz from './quizModel'
import auth from './middleware/auth'
const router = express.Router();

// Submit Score for a Quiz
router.post('/submit/:quizId', auth, async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;  // answers should be an array of answers
  const userId = req.user.id;

  try {
    // Find the quiz and validate the user's answers
    const quiz = await Quiz.findById(quizId);
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (question.answer === answers[index]) {
        score++;
      }
    });

    // Save the user's score
    const existingScore = quiz.scores.find(score => score.user.toString() === userId.toString());
    if (existingScore) {
      existingScore.score = score;
    } else {
      quiz.scores.push({ user: userId, score });
    }

    await quiz.save();
    res.json({ score });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error submitting score' });
  }
});

// Get Leaderboard for a Quiz
router.get('/leaderboard/:quizId', async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId).populate('scores.user', 'username').sort({ 'scores.score': -1 }).limit(10);
    res.json(quiz.scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error fetching leaderboard' });
  }
});

module.exports = router;