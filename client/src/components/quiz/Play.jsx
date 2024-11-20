import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Helmet } from "react-helmet";
import Icon from "@mdi/react";
import { useNavigate } from "react-router-dom";
import { mdilLightbulbOn, mdilArrowRight, mdilArrowLeft } from "@mdi/light-js";
import { mdiBatteryCharging } from "@mdi/js";
import questions from "../../questions.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import correct from "../../assets/img/audio/correct.mp3";
import incorrect from "../../assets/img/audio/incorrect.mp3";
import nextprev from "../../assets/img/audio/next-prev.mp3";
import quit from "../../assets/img/audio/quit.mp3";
import isEmpty from "../../utils/isEmpty";
import classNames from "classnames";

const Play = (props) => {
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [nextQuestion, setNextQuestion] = useState({});
  const [previousQuestion, setPreviousQuestion] = useState({});
  const [answer, setAnswer] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [numberofAnsweredQuestions, setNumberofAnsweredQuestions] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [hints, setHints] = useState(5);
  const [fiftyFifty, setFiftyFifty] = useState(2);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [previousRandomNumbers, setPreviousRandomNumbers] = useState([]);
  const [interval, setIntervalState] = useState(null);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
  const [previousButtonDisabled, setPreviousButtonDisabled] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track selected answer
  const [answered, setAnswered] = useState(false); // Track if the question has been answered

  // Use the useNavigate hook to handle navigation
  const navigate = useNavigate();

  useEffect(() => {
    displayQuestions();
    startTimer();
    handleDisableButton();
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [currentQuestionIndex, previousQuestion, nextQuestion]);

  const displayQuestions = useCallback(() => {
    if (!isEmpty(questions)) {
      const current = questions[currentQuestionIndex];
      const next = questions[currentQuestionIndex + 1];
      const prev = questions[currentQuestionIndex - 1];
      setAnswer(current.answer);

      setCurrentQuestion(current);
      setNextQuestion(next);
      setPreviousQuestion(prev);
      setNumberOfQuestions(questions.length);
      setPreviousRandomNumbers([]);

      // setAnswered(false);
      showOptions();
    }
  }, [currentQuestionIndex]);

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
        endGame();
      } else {
        setTime({ minutes, seconds });
      }
    }, 1000);
    setIntervalState(intervalId);
  };

  // const handleOptionsClick = (e) => {
  //   if (e.target.innerHTML.toLowerCase() === answer.toLowerCase()) {
  //     const correctAudio = document.getElementById("correct");
  //     correctAudio.play();
  //     setTimeout(() => {
  //       correctAudio.pause();
  //       correctAudio.currentTime = 0;
  //     }, 3000);

  //     correctAnswer();
  //     navigator.vibrate(1000);
  //   } else {
  //     const incorrectAudio = document.getElementById("incorrect");
  //     incorrectAudio.play();
  //     setTimeout(() => {
  //       incorrectAudio.pause();
  //       incorrectAudio.currentTime = 0;
  //     }, 3000);
  //     wrongAnswer();
  //   }
  // };

  const handleOptionsClick = (e) => {
    if (answered) return; // Prevent further clicks once the question is answered

    const selected = e.target.innerHTML.toLowerCase();
    setSelectedAnswer(selected);
    setAnswered(true); // Mark the question as answered

    if (selected === answer.toLowerCase()) {
      const correctAudio = document.getElementById("correct");
      correctAudio.play();
      setTimeout(() => {
        correctAudio.pause();
        correctAudio.currentTime = 0;
      }, 3000);

      correctAnswer();
      navigator.vibrate(1000);
    } else {
      const incorrectAudio = document.getElementById("incorrect");
      incorrectAudio.play();
      setTimeout(() => {
        incorrectAudio.pause();
        incorrectAudio.currentTime = 0;
      }, 3000);

      wrongAnswer();
    }
  };


  const correctAnswer = () => {
    toast.success("Correct answer");

    setScore((prevScore) => prevScore + 1);
    setCorrectAnswers((prev) => prev + 1);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setNumberofAnsweredQuestions((prev) => prev + 1);

    if (nextQuestion === undefined) {
      endGame();
    } else {
      displayQuestions();
    }
  };

  const wrongAnswer = () => {
    if (navigator.vibrate) {
      navigator.vibrate(1000); // Vibrate for 1 second
    }
    toast.error("Wrong answer");

    setWrongAnswers((prev) => prev + 1);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setNumberofAnsweredQuestions((prev) => prev + 1);

    if (nextQuestion === undefined) {
      endGame();
    } else {
      displayQuestions();
    }
  };

  const handleButtonClick = (e) => {
    switch (e.target.id) {
      case "next":
        handleNextButton();
        break;
      case "previous":
        handlePreviousButton();
        break;
      case "quit":
        handleQuitButton();
        break;
      default:
        break;
    }
  };

  const handleNextButton = () => {
    playButtonSound();
    if (nextQuestion) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousButton = () => {
    playButtonSound();
    if (previousQuestion) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const playButtonSound = () => {
    document.getElementById("nextprev").play();
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

    const quitConfirmation = toast.warning("Are you sure you want to quit?");
    if (quitConfirmation) {
      endGame(); // End game and save score
    }
  };

  const playQuitSound = () => {
    const quitAudio = document.getElementById("quit");
    if (quitAudio) {
      quitAudio.play();
    }
  };

  const showOptions = () => {
    const options = Array.from(document.querySelectorAll(".option"));
    options.forEach((option) => {
      option.style.visibility = "visible";
    });
    setUsedFiftyFifty(false);
  };

  const handleHints = () => {
    if (hints > 0) {
      const options = Array.from(document.querySelectorAll(".option"));
      let indexOfAnswer;
      options.forEach((option, index) => {
        if (option.innerHTML.toLowerCase() === answer.toLowerCase()) {
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

  const handleFiftyFifty = () => {
    if (fiftyFifty > 0 && !usedFiftyFifty) {
      const options = Array.from(document.querySelectorAll(".option"));
      let indexOfAnswer;

      options.forEach((option, index) => {
        if (option.innerHTML.toLowerCase() === answer.toLowerCase()) {
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

  const handleDisableButton = () => {
    if (currentQuestionIndex === 0) {
      setPreviousButtonDisabled(true);
    } else {
      setPreviousButtonDisabled(false);
    }

    if (nextQuestion === undefined) {
      setNextButtonDisabled(true);
    } else {
      setNextButtonDisabled(false);
    }
  };

  const endGame = () => {
    const playerStat = {
      score: Math.round((score / numberOfQuestions) * 100),
      numberOfQuestions,
      numberofAnsweredQuestions,
      correctAnswers,
      wrongAnswers,
      fiftyFifty: 2 - fiftyFifty,
      hints: 5 - hints,
    };
    setTimeout(() => {
      // Use navigate to redirect to the '/quizsummary' route, passing playerStat as state
      navigate("/quizsummary", { state: playerStat });
    }, 1000);
  };


  return (
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
              {currentQuestionIndex + 1} of {numberOfQuestions}
            </span>
          </p>
        </div>
        <h5>{currentQuestion.question}</h5>

        <div className="options-container">
          <p
            onClick={handleOptionsClick}
            className={classNames("option", {
              correct:
                selectedAnswer === currentQuestion.optionA &&
                answered &&
                currentQuestion.optionA === answer,
              incorrect:
                selectedAnswer === currentQuestion.optionA &&
                answered &&
                currentQuestion.optionA !== answer,
              disabled: answered,
            })}
          >
            {currentQuestion.optionA}
          </p>
          
          <ToastContainer position="top-center" autoClose={3000} />
          <p
            onClick={handleOptionsClick}
            className={classNames("option", {
              correct:
                selectedAnswer === currentQuestion.optionB &&
                answered &&
                currentQuestion.optionB === answer,
              incorrect:
                selectedAnswer === currentQuestion.optionB &&
                answered &&
                currentQuestion.optionB !== answer,
              disabled: answered,
            })}
          >
            {currentQuestion.optionB}
          </p>
        </div>

        <div className="options-container">
          <p
            onClick={handleOptionsClick}
            className={classNames("option", {
              correct:
                selectedAnswer === currentQuestion.optionC &&
                answered &&
                currentQuestion.optionC === answer,
              incorrect:
                selectedAnswer === currentQuestion.optionC &&
                answered &&
                currentQuestion.optionC !== answer,
              disabled: answered,
            })}
          >
            {currentQuestion.optionC}
          </p>
          <p
            onClick={handleOptionsClick}
            className={classNames("option", {
              correct:
                selectedAnswer === currentQuestion.optionD &&
                answered &&
                currentQuestion.optionD === answer,
              incorrect:
                selectedAnswer === currentQuestion.optionD &&
                answered &&
                currentQuestion.optionD !== answer,
              disabled: answered,
            })}
          >
            {currentQuestion.optionD}
          </p>
        </div>

        {/* <div className="options-container">
          <p onClick={handleOptionsClick} className="option">
            <ToastContainer position="top-center" autoClose={3000} />
            {currentQuestion.optionA}
          </p>
          <p onClick={handleOptionsClick} className="option">
            {currentQuestion.optionB}
          </p>
        </div>

        <div className="options-container">
          <p onClick={handleOptionsClick} disabled className="option">
            {currentQuestion.optionC}
          </p>
          <p onClick={handleOptionsClick} className="option">
            {currentQuestion.optionD}
          </p>
        </div> */}

        <div className="button-container">
          <button
            id="previous"
            onClick={handleButtonClick}
            className={classNames("", { disable: previousButtonDisabled })}
          >
            <Icon path={mdilArrowLeft} size={1} />
            Previous
          </button>

          <button
            id="next"
            onClick={handleButtonClick}
            className={classNames("", { disable: nextButtonDisabled })}
          >
            Next <Icon path={mdilArrowRight} size={1} />
          </button>
          <button id="quit" onClick={handleButtonClick}>
            Quit
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Play;
