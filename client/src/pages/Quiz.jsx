import React, { Fragment, useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { mdilLightbulbOn, mdilArrowRight, mdilArrowLeft } from "@mdi/light-js";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import correct from "../assets/img/audio/correct.mp3";
import incorrect from "../assets/img/audio/incorrect.mp3";
import nextprev from "../assets/img/audio/next-prev.mp3";
import quit from "../assets/img/audio/quit.mp3";
import classNames from "classnames";
import Icon from "@mdi/react";
import { mdiBatteryCharging } from "@mdi/js";
import QuitConfirmation from "../components/QuitConfirmation";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [startQuiz, setStartQuiz] = useState(false);
  const [questionChanged, setQuestionChanged] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [answers, setAnswers] = useState({});
  const [interval, setIntervalState] = useState(null);
  const [hints, setHints] = useState(5);
  const [fiftyFifty, setFiftyFifty] = useState(2);
  const [startError, setStartError] = useState("");
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [previousRandomNumbers, setPreviousRandomNumbers] = useState([]);
  const [quitModalOpen, setQuitModalOpen] = useState(false); // State to control the quit modal
  const [countdown, setCountdown] = useState(3); // State for countdown

  const navigate = useNavigate();

  const selectAnswer = (questionId, answer) => {
    console.log(questionId);

    setAnswers({ ...answers, [questionId]: answer });
    if (currentQuestion.correctAnswer === answer) {
      const correctAudio = document.getElementById("correct");
      correctAudio.play();
      setTimeout(() => {
        correctAudio.pause();
        correctAudio.currentTime = 0;
      }, 3000);
      toast.success("Correct answer");
    } else {
      const incorrectAudio = document.getElementById("incorrect");
      incorrectAudio.play();
      setTimeout(() => {
        incorrectAudio.pause();
        incorrectAudio.currentTime = 0;
      }, 3000);
      toast.error("Wrong answer");
    }
    if (currentQuestionIndex < questions.length - 1) {
      handleNext();
    } else {
      handleSubmit();
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
        toast.info("Quiz has ended due to time expiration.");
        // endGame();
      } else {
        setTime({ minutes, seconds });
      }
    }, 1000);
    setIntervalState(intervalId);
  };

  const getQuestions = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    try {
      const response = await api.get("/question/daily-questions");
      console.log("API response:", response.data);
      setQuestions(response.data); // Assuming response.data is the correct structure
    } catch (err) {
      console.log(err.status);

      if (err.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      // if (err.status === 400) {
      //   navigate("/dashboard");
      // }
      console.error("API error:", err);

      //setError("Failed to load daily questions.");
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const showOptions = () => {
    const options = Array.from(document.querySelectorAll(".option"));
    options.forEach((option) => {
      option.style.visibility = "visible";
    });
    setUsedFiftyFifty(false);
  };

  const handleFiftyFifty = () => {
    if (fiftyFifty > 0 && !usedFiftyFifty) {
      const options = Array.from(document.querySelectorAll(".option"));
      let indexOfAnswer;

      options.forEach((option, index) => {
        if (
          option.innerHTML.toLowerCase() ===
          currentQuestion.correctAnswer.toLowerCase()
        ) {
          indexOfAnswer = index;
        }
      });

      const randomNumbers = [];
      let count = 0;

      do {
        const randomNumber = Math.floor(Math.random() * 4);
        if (
          randomNumber !== indexOfAnswer &&
          !randomNumbers.includes(randomNumber)
        ) {
          randomNumbers.push(randomNumber);
          count++;
        }
      } while (count < 2);

      options.forEach((option, index) => {
        if (randomNumbers.includes(index)) {
          option.style.visibility = "hidden";
        }
      });

      setFiftyFifty((prev) => prev - 1);
      setUsedFiftyFifty(true);
    }
  };

  const handleHints = () => {
    if (hints > 0) {
      const options = Array.from(document.querySelectorAll(".option"));
      let indexOfAnswer;
      options.forEach((option, index) => {
        if (
          option.innerHTML.toLowerCase() ===
          currentQuestion.correctAnswer.toLowerCase()
        ) {
          indexOfAnswer = index;
        }
      });
      while (true) {
        const randomNumber = Math.round(Math.random() * 3);
        if (
          randomNumber !== indexOfAnswer &&
          !previousRandomNumbers.includes(randomNumber)
        ) {
          options.forEach((option, index) => {
            if (index === randomNumber) {
              option.style.visibility = "hidden";
              setHints((prevHints) => prevHints - 1);
              setPreviousRandomNumbers((prev) => [...prev, randomNumber]);
            }
          });
          break;
        }
        if (previousRandomNumbers.length >= 3) break;
      }
    }
  };

  const playQuitSound = () => {
    const quitAudio = document.getElementById("quit");
    if (quitAudio) {
      quitAudio.play();
    }
  };
  const handleQuitButton = () => {
    playQuitSound();
    setTimeout(() => {
      const quitAudio = document.getElementById("quit");
      if (quitAudio) {
        quitAudio.pause();
        quitAudio.currentTime = 0;
      }
    }, 3000);

    //   endGame(); // End game and save score
  };

  const handleStart = async () => {
    try {
      const response = await api.put("/quiz/start");
      console.log("API response:", response.data);
      setStartQuiz(true);
      setCurrentQuestionIndex(0);
      startTimer();
    } catch (err) {
      console.error("API error:", err);
      setStartError("Failed to start quiz.");
    }
  };

  const openQuitModal = () => {
    setQuitModalOpen(true);
  };

  const closeQuitModal = () => {
    setQuitModalOpen(false);
  };

  const confirmQuit = () => {
    handleSubmit();
    navigate("/dashboard"); // Example: Navigate to the dashboard
  };

  const handleSubmit = async () => {
    console.log("i got here");

    try {
      const response = await api.put("/quiz/submit", answers);
      console.log("API response:", response.data);
    } catch (err) {
      console.error("API error:", err);
    }
  };

  useEffect(() => {
    showOptions();
  }, [currentQuestionIndex]);

  // Countdown logic
  useEffect(() => {
    let countdownInterval;
    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(countdownInterval);
      handleStart(); // Start the quiz after the countdown
    }
    return () => clearInterval(countdownInterval);
  }, [countdown]);

  const currentQuestion = questions[currentQuestionIndex];

  return questions ? (
    startQuiz ? (
      <Fragment>
        <ToastContainer />
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
            <p>
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
            </p>
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
                onClick={() => selectAnswer(currentQuestion._id, option)}
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
              disabled={currentQuestionIndex === 0}
              onClick={handlePrevious}
              className={classNames("", {
                disable: currentQuestionIndex === 0,
              })}
            >
              <Icon path={mdilArrowLeft} size={1} />
              Previous
            </button>
            <button
              id="next"
              disabled={!(currentQuestionIndex < questions.length - 1)}
              onClick={handleNext}
              className={classNames("", {
                disable: !(currentQuestionIndex < questions.length - 1),
              })}
            >
              Next <Icon path={mdilArrowRight} size={1} />
            </button>
            <button id="quit" onClick={openQuitModal}>
              Quit
            </button>
          </div>
        </div>
        <QuitConfirmation
          isOpen={quitModalOpen}
          onClose={closeQuitModal}
          onConfirm={confirmQuit}
        />
        ;
      </Fragment>
    ) : (
      <div className="countdown-container">
        <div className="countdown-title">Your quiz starts in</div>
        <div className="countdown-number">{countdown}</div>
      </div>
    )
  ) : (
    <div>
      <h1>Loading...</h1>
    </div>
  );
};

export default Quiz;
