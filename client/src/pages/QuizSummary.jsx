import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Helmet from "react-helmet";
import Icon from "@mdi/react";
import { Link } from "react-router-dom";
import { mdiAccountCheckOutline } from "@mdi/js";
import confetti from "canvas-confetti";
import { quizStore } from "../store/quizStore";

const QuizSummary = () => {
  // Use useLocation hook to get state passed via navigate()
  const location = useLocation();
  const {playerStats} = quizStore();
  //const playerStat = location.state;
  console.log(playerStats)

  c//onst {state} = location
  let remark, stat;
  const userScore = playerStats.score;
  
 const celebrateWithConfetti = () => {
   confetti({
     particleCount: 400,
     spread: 70,
     origin: { x: 0.5, y: 0.5 },
     colors: ["#ff0", "#0f0", "#f00", "#00f"],
   });
 };
 
  if(userScore < 30 ){
    remark='you need more practice'
  }else if(userScore >30 && userScore <=50){
    remark= 'better luck next time';
  }else if(userScore <=70 &&userScore >50){
     remark = 'good try';
  }else if(userScore >=71 && userScore <=84 ){
     remark = 'you did great!';

  }else{
     remark = "you are an absolute genius!";
  }

  if(userScore > 60){
     celebrateWithConfetti();
  }

if (playerStats.score !== null) {
  stat = (
    <>
      <div className="status-container">
        <span className="status-icon">
          <Icon
            path={mdiAccountCheckOutline}
            size={3}
            style={{ color: "green" }}
          />
        </span>
        <h1 className="status-heading">Quiz Summary</h1>
      </div>

      <div className="result-container">
        <h4 className="remark">{remark}</h4>
        <h2 className="score">
          Your Score: {playerStats.score.toFixed(0)}&#37;
        </h2>

        <div className="question-stats">
          <div className="stat-item">
            <span className="stat-label">Number of Questions:</span>
            <span className="stat-value">{playerStats.numberOfQuestions}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Attempted Questions:</span>
            <span className="stat-value">
              {playerStats.numberofAnsweredQuestions}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Correct Answers:</span>
            <span className="stat-value">{playerStats.correctAnswers}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Wrong Answers:</span>
            <span className="stat-value">{playerStats.wrongAnswers}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Hints Used:</span>
            <span className="stat-value">{playerStats.hints}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">50-50 Used:</span>
            <span className="stat-value">{playerStats.fiftyFifty}</span>
          </div>
        </div>
      </div>

      <section className="navigation">
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <span style={{ color: "white" }}>|</span>
          <li>
            <Link to={"/quiz/play"}>Play Again</Link>
          </li>
          <span style={{ color: "white" }}>|</span>
          <li>
            <Link to={"/leaderboard"}>View Leaderboard</Link>
          </li>
        </ul>
      </section>
    </>
  );
} else {
  stat = (
    <>
      <h1 className="no-stat">No stats available</h1>
      <p className="no-stat-p">please take a quiz 🤗</p>

      <section className="navigation">
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/quiz/play"}>Take Quiz</Link>
          </li>
          <li>
            <Link to={"/leaderboard"}>Leaderboard</Link>
          </li>
        </ul>
      </section>
    </>
  );
}


  return (
    <>
      <Helmet>
        <title>Quiz Summary</title>
      </Helmet>
      
      {stat}
    
    </>
  );
};

export default QuizSummary;
