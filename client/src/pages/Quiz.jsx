import React, { Fragment, useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { mdilLightbulbOn, mdilArrowRight, mdilArrowLeft } from "@mdi/light-js";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import correct from "../assets/img/audio/correct.mp3";
import incorrect from "../assets/img/audio/incorrect.mp3";
import nextprev from "../assets/img/audio/next-prev.mp3";
import quit from "../assets/img/audio/quit.mp3";
import classNames from "classnames";
import Icon from "@mdi/react";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [startQuiz, setStartQuiz] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [answers, setAnswers] = useState({});

  const navigate = useNavigate();

  const selecAnswer = (questionId, answer) => {
    console.log(questionId);
    
    setAnswers({ ...answers, [questionId]: answer });
    if (currentQuestion.correctAnswer === answer) {
      toast.success("Correct answer");
    } else {
      toast.error("Wrong answer");
    }
    if (currentQuestionIndex < questions.length - 1) {
        handleNext()
    }else{
        // handleSubmit()
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    console.log(answers);
    
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const startTimer = () => {
    const countDownTime = Date.now() + 300000;
    const intervalId = setInterval(() => {
      const now = new Date();
      const distance = countDownTime - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(intervalId);
        setTime({ minutes: 0, seconds: 0 });
        toast.warning("Quiz has ended due to time expiration.");
        // endGame();
      } else {
        setTime({ minutes, seconds });
      }
    }, 1000);
    setIntervalState(intervalId);
  };

  useEffect(() => {
    const getQuestions = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      }
      try {
        const response = await api.get("/question/daily-questions");
        console.log("API response:", response.data);
        setQuestions(response.data); // Assuming response.data is the correct structure
      } catch (err) {
        if (err.code === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("API error:", err);
        setError("Failed to load daily questions.");
      }
    };

    getQuestions();
  }, []);

  const handleStart = async () => {
    // const response = await api.get("/question/daily-questions");
    //     console.log("API response:", response.data);
    setStartQuiz(true);
    setCurrentQuestion(questions[0]);
  };
  const currentQuestion = questions[currentQuestionIndex];


  return questions ? (
    startQuiz ? (
      <Fragment>
        <Helmet>
          <title>Quiz Page</title>
        </Helmet>

        <audio id="correct" src={correct}></audio>
        <audio id="incorrect" src={incorrect}></audio>
        <audio id="nextprev" src={nextprev}></audio>
        <audio id="quit" src={quit}></audio>

        <div className="questions">
          <h2>Quiz Mode</h2>
          <div className="lifeline-container">
            {/* <p>
        <span onClick={handleFiftyFifty} className="lifeline-icon">
          <Icon path={mdiBatteryCharging} size={1} />
          <span className="lifeline">{fiftyFifty}</span>
        </span>
      </p>
      <p>
        <span onClick={handleHints} className="lifeline-icon">
          <Icon path={mdilLightbulbOn} size={1} />
          <span className="lifeline">{hints}</span>
        </span>
      </p> */}
          </div>
          <div>
            <p>
              <span className="left" style={{ float: "right" }}>
                {time.minutes}:{time.seconds} <span className="watch">⌚</span>
              </span>
              <span className="right">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </p>
          </div>
          <h5>{currentQuestion.content}</h5>

          <div className="options-container">
            {currentQuestion?.options.map((option, index) => (
              <button
                onClick={() => selecAnswer(currentQuestion._id, option)}
                disabled={answers[currentQuestion._id]}
                key={index}
                className={classNames("option", {
                  correct:
                    answers[currentQuestion._id] &&
                    option === currentQuestion.correctAnswer,
                  incorrect:
                    answers[currentQuestion._id] &&
                    answers[currentQuestion._id] === option &&
                    answers[currentQuestion._id] !==
                      currentQuestion.correctAnswer,
                  disabled: answers[currentQuestion._id],
                })}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="button-container">
      <button
        id="previous"
        disabled= {(currentQuestionIndex === 0)}
        onClick={handlePrevious}
        className={classNames("", { disable: (currentQuestionIndex === 0) })}
      >
        <Icon path={mdilArrowLeft} size={1} />
        Previous
      </button>
      <button
        id="next"
        disabled= {!(currentQuestionIndex < questions.length - 1)}
        onClick={handleNext}
        className={classNames("", { disable: !(currentQuestionIndex < questions.length - 1) })}
      >
        Next <Icon path={mdilArrowRight} size={1} />
      </button>
      {/* <button id="quit" onClick={handleButtonClick}>
        Quit
      </button> */}
    </div>
        </div>
      </Fragment>
    ) : (
      <div>
        <button onClick={handleStart}>Start Quiz</button>
      </div>
    )
  ) : (
    <div>
      <h1>Loading...</h1>
    </div>
  );
};

export default Quiz;
