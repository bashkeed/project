import React from "react";
import { useLocation } from "react-router-dom";

const QuizSummary = () => {
  // Use useLocation hook to get state passed via navigate()
  const location = useLocation();
  const playerStat = location.state;

  return (
    <div>
      <h1>Quiz Summary</h1>
      <pre>{JSON.stringify(playerStat, null, 2)}</pre>
    </div>
  );
};

export default QuizSummary;
