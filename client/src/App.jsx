import { Route, Routes } from "react-router-dom";
import React from "react"; // Ensure React is imported
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
// import Instructions from "./components/quiz/Instructions";
import QuizSummary from "./pages/QuizSummary";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";

function App(){
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/quizsummary" element={<QuizSummary />} />
 
    </Routes>
  );
}

export default App;
