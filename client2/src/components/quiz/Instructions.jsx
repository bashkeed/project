import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

const Instructions = () => {
  return (
    <>
      <Helmet>
        <title>Quiz Intructions - learnFly</title>
      </Helmet>
      <div className="instructions container d-flex flex-column align-items-center">
        <h1>HOW TO PLAY THE GAME</h1>
        <h5>be sure to read this guide from start to finish</h5>
        <ul className="browser-default" id="main-list">
          <li>
            the game has a duration of 10 minutes and ends as soon as your time
            elapses
          </li>
          <li>each game consists of 10 questions</li>
          <li>each question consist of 4 options</li>
        </ul>
      </div>
      <div className="d-flex justify-content-between mb-3 mx-lg-3 mb-2">
        <span className="left">
          <Link to={""}>go back</Link>
        </span>
        <span className="right">
          <Link to={'/quiz/play'}>right, lets play</Link>
        </span>
      </div>
    </>
  );
}

export default Instructions