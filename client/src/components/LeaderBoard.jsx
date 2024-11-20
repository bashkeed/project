import React from "react";
import { Link } from "react-router-dom";

function LeaderBoard() {
  const data = [
    { position: "1st", name: "Samira Hadid", score: 5400 },
    { position: "2nd", name: "Zubair Bashir", score: 5320 },
    { position: "3rd", name: "Aisha Adekemi", score: 5000 },
    { position: "4th", name: "John Okafor", score: 4875 },
    { position: "5th", name: "Juliana Nosakhare", score: 4565 },
  ];

  return (
    <>
      <h2 className="caption">Introducing our national brain boxes</h2>
      <div className="animation">
        <div className="stripe stripe1"></div>
        <div className="stripe stripe2"></div>
        <div className="stripe stripe3"></div>
      </div>
      <div className="leaderboard">
        <div className="header">
          <div className="header-item">Position</div>
          <div className="header-item">Name</div>
          <div className="header-item">Score</div>
        </div>
        {data.map((item, index) => (
          <div key={index} className="row">
            <div className="item">{item.position}</div>
            <div className="item">{item.name}</div>
            <div className="item score">{item.score}</div>
          </div>
        ))}
      </div>

      <section className="navigation">
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <span style={{ color: "white" }}>|</span>
          <li>
            <Link to={"/quiz/play"}>Take Quiz</Link>
          </li>
        </ul>
      </section>
    </>
  );
}


export default LeaderBoard;
