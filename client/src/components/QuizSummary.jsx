import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Helmet from "react-helmet";
import Icon from "@mdi/react";
import { Link } from "react-router-dom";
import { mdiAccountCheckOutline } from "@mdi/js";

const QuizSummary = () => {
  // Use useLocation hook to get state passed via navigate()
  const location = useLocation();
  const playerStat = location.state;
 console.log(playerStat)

  const {state} = location
  let remark, stat;
  const userScore= state.score;
  

 
  if(userScore < 30 ){
    remark='you need more practice'
  }else if(userScore >30 && userScore <=50){
    remark= 'best luck next time';
  }else if(userScore <=70 &&userScore >50){
     remark = 'you can do better';
  }else if(userScore >=71 && userScore <=84 ){
     remark = 'you did great!';

  }else{
     remark = "you are an absolute genius!";
  }

if (state !== null) {
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
          Your Score: {playerStat.score.toFixed(0)}&#37;
        </h2>

        <div className="question-stats">
          <div className="stat-item">
            <span className="stat-label">Number of Questions:</span>
            <span className="stat-value">{playerStat.numberOfQuestions}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Attempted Questions:</span>
            <span className="stat-value">
              {playerStat.numberofAnsweredQuestions}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Correct Answers:</span>
            <span className="stat-value">{playerStat.correctAnswers}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Wrong Answers:</span>
            <span className="stat-value">{playerStat.wrongAnswers}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Hints Used:</span>
            <span className="stat-value">{playerStat.hints}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">50-50 Used:</span>
            <span className="stat-value">{playerStat.fiftyFifty}</span>
          </div>
        </div>
      </div>

      <section className="navigation">
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/quiz/play"}>Play Again</Link>
          </li>
        </ul>
      </section>
    </>
  );
} else {
  stat = (
    <>
      <h1 className="no-stat">No stats available</h1>
      <p className="no-stat-p">
        please take a quiz 🤗
      </p>

      <section className="navigation">
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/quiz/play"}>Take Quiz</Link>
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
     
    
      <pre>{JSON.stringify(playerStat, null, 2)}</pre>
    </>
  );
};

export default QuizSummary;
