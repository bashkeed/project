import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Instructions from "./components/quiz/Instructions";
import History from "./components/History";
import Play from "./components/quiz/Play";
import QuizSummary from "./components/quizSummary";
import LeaderBoard from "./components/LeaderBoard";


function App(){
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/history" element={<History />} />
      <Route path="/quiz/play" element={<Play />} />
      <Route path="/quiz/instructions" element={<Instructions />} />
      <Route path="/quizsummary" element={<QuizSummary />} />
      <Route path="/leaderboard" element={<LeaderBoard />} />
    </Routes>
  );
}

export default App;
