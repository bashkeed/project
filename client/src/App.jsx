import { Route, Routes } from "react-router-dom";
import React from "react"; // Ensure React is imported
//import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Instructions from "./components/quiz/Instructions";
import Play from "./components/quiz/Play";
import QuizSummary from "./pages/QuizSummary";
import LeaderBoard from "./components/LeaderBoard";
import DailyQuestions from "./components/DailyQuestions";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";


function App(){
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/quiz/play" element={<Play />} />
      <Route path="/quiz/instructions" element={<Instructions />} />
      <Route path="/quizsummary" element={<QuizSummary />} />
      <Route path="/leaderboard" element={<LeaderBoard />} />
      <Route path="/questions" element={<DailyQuestions />} />
    </Routes>
  );
}

export default App;
