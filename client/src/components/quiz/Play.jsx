import React,{Component, Fragment} from "react";
import { Helmet } from "react-helmet";
import Icon from "@mdi/react";
import { mdilLightbulbOn, mdilArrowRight, mdilArrowLeft } from "@mdi/light-js";
import { mdiBatteryCharging } from "@mdi/js";
import questions from '../../questions.json'
 import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
import correct from '../../assets/img/audio/correct.mp3'
import incorrect from "../../assets/img/audio/incorrect.mp3";
import nextprev from "../../assets/img/audio/next-prev.mp3";
import quit from "../../assets/img/audio/quit.mp3";
import isEmpty from "../../utils/isEmpty";

//import isEmpty from "../../utils/isEmpty";



class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions,
      currentQuestion: {},
      nextQuestion: {},
      previousQuestion: {},
      answer: "",
      numberOfQuestions: 0,
      numberofAnsweredQuestions: 0,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hints: 5,
      fiftyFifty: 2,
      usedFiftyFifty: false,
      time: {},
      previousRandomNumbers: [],
    };
    this.interval = null
  }

  componentDidMount() {
    const { questions, currentQuestion, nextQuestion, previousQuestion } =
      this.state;
    this.displayQuestions(
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion
      
    );
    this.startTimer();
  }

  displayQuestions = () => {
    let { currentQuestionIndex, questions } = this.state;

    // Check if questions exist and are not empty
    if (!isEmpty(questions)) {
      const currentQuestion = questions[currentQuestionIndex];
      const nextQuestion = questions[currentQuestionIndex + 1] || null; // Safeguard if nextQuestion is out of bounds
      const previousQuestion = questions[currentQuestionIndex - 1] || null; // Safeguard if previousQuestion is out of bounds
      const answer = currentQuestion.answer;

      // Update the state with the current question, previous/next questions, and answer
      this.setState(
        {
          currentQuestion,
          nextQuestion,
          previousQuestion,
          answer,
          numberOfQuestions: questions.length,
          previousRandomNumbers: [],
        },
        () => {
          this.showOptions();
        }
      );
    }
  };

  correctAnswer = () => {
    toast.success("Correct answer");

    this.setState(
      (prevState) => ({
        score: prevState.score + 1,
        correctAnswers: prevState.correctAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberofAnsweredQuestions: prevState.numberofAnsweredQuestions + 1,
      }),
      () => {
        // Callback function that runs after state is updated
        this.displayQuestions(
          this.state.questions,
          this.state.currentQuestion,
          this.state.nextQuestion,
          this.state.previousQuestion
        );
      }
    );
  };

  wrongAnswer = () => {
    navigator.vibrate(1000);
    toast.error("Wrong answer");
    this.setState(
      (prevState) => ({
        wrongAnswers: prevState.wrongAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberofAnsweredQuestions: prevState.numberofAnsweredQuestions + 1,
      }),
      () => {
        this.displayQuestions(
          this.state.questions,
          this.state.currentQuestion,
          this.state.nextQuestion,
          this.state.previousQuestion
        );
      }
    );
  };

  handleOptionsClick = (e) => {
    if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
      const correct = document.getElementById("correct");
      correct.play();
      // Stop the sound after 3 seconds (3000 milliseconds)
      setTimeout(() => {
        correct.pause(); // Stops the sound
        correct.currentTime = 0; // Resets the playback to the start
      }, 3000); // 3000 milliseconds = 3 seconds

      this.correctAnswer();
      navigator.vibrate(1000);
    } else {
      const wrong = document.getElementById("incorrect");
      wrong.play();
      setTimeout(() => {
        wrong.pause();
        wrong.currentTime = 0;
      }, 3000);
      this.wrongAnswer();
    }
  };

  handleNextButton = () => {
    this.playButtonSound();
    if (this.state.nextQuestion != undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
        }),
        () => {
          this.displayQuestions(
            this.state,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      );
    }
  };

  handlePreviousButton = () => {
    this.playButtonSound();
    if (this.state.previousQuestion != undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex - 1,
        }),
        () => {
          this.displayQuestions(
            this.state,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      );
    }
  };

  handleButtonClick = (e) => {
    switch (e.target.id) {
      case "next":
        this.handleNextButton();
        break;
      case "previous":
        this.handlePreviousButton();
        break;
      case "quit":
        this.handleQuitButton();
        break;

      default:
        break;
    }
  };

  playButtonSound = () => {
    document.getElementById("nextprev").play();
  };

  handleQuitButton = () => {
    this.playQuitSound(); // Play the quit sound

    // Set a timeout to stop the sound after 3 seconds
    setTimeout(() => {
      const quit = document.getElementById("quit");
      if (quit) {
        quit.pause(); // Pause the audio
        quit.currentTime = 0; // Reset the audio to the start
      }
    }, 3000); // 3000 milliseconds = 3 seconds

    // Show the confirmation prompt
    if (window.confirm("Are you sure you want to quit?")) {
      this.props.history.push("/"); // Navigate to home if user confirms
    }
  };

  // Method to play the quit sound (e.g., set the audio source)
  playQuitSound = () => {
    const quitSound = document.getElementById("quit");
    if (quitSound) {
      quitSound.play(); // Play the sound
    }
  };
  showOptions = () => {
    const options = Array.from(document.querySelectorAll(".option"));
    options.forEach((option) => {
      option.style.visibility = "visible";
    });
    this.setState({
      usedFiftyFifty: false,
    });
  };

  handleHints = () => {
    if (this.state.hints > 0) {
      const options = Array.from(document.querySelectorAll(".option"));
      let indexOfAnswer;
      options.forEach((option, index) => {
        if (option.innerHTML.toLowerCase() == this.state.answer.toLowerCase()) {
          indexOfAnswer = index;
        }
      });
      while (true) {
        const randomNumber = Math.round(Math.random() * 3);
        if (
          randomNumber != indexOfAnswer &&
          !this.state.previousRandomNumbers.includes(randomNumber)
        ) {
          options.forEach((option, index) => {
            if (index === randomNumber) {
              option.style.visibility = "hidden";
              this.setState((prevState) => ({
                hints: prevState.hints - 1,
                previousRandomNumbers:
                  prevState.previousRandomNumbers.concat(randomNumber),
              }));
            }
          });
          break;
        }
        if (this.state.previousRandomNumbers.length >= 3) break;
      }
    }
  };

  handleFiftyFifty = () => {
    const { fiftyFifty, usedFiftyFifty, answer } = this.state;

    if (fiftyFifty > 0 && !usedFiftyFifty) {
      const options = Array.from(document.querySelectorAll(".option"));
      let indexOfAnswer;

      // Find the index of the correct answer
      options.forEach((option, index) => {
        if (option.innerHTML.toLowerCase() === answer.toLowerCase()) {
          indexOfAnswer = index;
        }
      });

      // Ensure we have a valid index for the answer
      if (indexOfAnswer === undefined) return;

      const randomNumbers = [];
      let count = 0;

      // Select two random incorrect answers
      do {
        const randomNumber = Math.floor(Math.random() * 4);

        // Ensure we don't select the correct answer or a previously selected random number
        if (
          randomNumber !== indexOfAnswer &&
          !randomNumbers.includes(randomNumber)
        ) {
          randomNumbers.push(randomNumber);
          count++;
        }
      } while (count < 2);

      // Hide the randomly selected incorrect answers
      options.forEach((option, index) => {
        if (randomNumbers.includes(index)) {
          option.style.visibility = "hidden";; // Use 'none' to remove from layout completely
        }
      });

      // Update state to reflect the usage of 50/50 and decrease its count
      this.setState((prevState) => ({
        fiftyFifty: prevState.fiftyFifty - 1,
        usedFiftyFifty: true,
      }));
    }
  };

  startTimer=()=>{
    const countDownTime = Date.now() + 30000;
    this.interval = setInterval(()=>{
      const now = new Date()
      const distance = countDownTime - now;
const minutes = Math.floor((distance % (1000 * 60 * 60))/(1000*60))
const seconds = Math.floor((distance % (1000 * 60 )) / (1000));

if(distance < 0){
  clearInterval(this.interval)
  this.setState({time:{
    minutes:0,
    seconds:0
  }

  }, ()=>{
alert('quiz has ended');
this.props.history.push('/')
  });
} else{
  this.setState({
    time:{
      minutes,
      seconds
    }
  })
}
    },1000)
  }

  render() {
    console.log(questions);
    const {
      fiftyFifty,
      currentQuestion,
      currentQuestionIndex,
      numberOfQuestions,
      hints,
      time
    } = this.state;
    return (
      <Fragment>
        <Helmet>
          <title>Quiz Page</title>
        </Helmet>

        <>
          <audio id="correct" src={correct}></audio>
          <audio id="incorrect" src={incorrect}></audio>
          <audio id="nextprev" src={nextprev}></audio>
          <audio id="quit" src={quit}></audio>
        </>

        <div className="questions">
          <h2>Quiz Mode</h2>
          <div className="lifeline-container">
            <p>
              <span onClick={this.handleFiftyFifty} className="lifeline-icon">
                <Icon path={mdiBatteryCharging} size={1} />{" "}
                <span className="lifeline">{fiftyFifty}</span>
              </span>
            </p>
            <p>
              <span onClick={this.handleHints} className="lifeline-icon">
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
                {currentQuestionIndex + 1} of {numberOfQuestions}{" "}
              </span>
              <span className="lifeline"></span>
            </p>
          </div>
          <h5>{currentQuestion.question}</h5>
          {console.log(currentQuestion)}
          <div className="options-container">
            <p onClick={this.handleOptionsClick} className="option">
              <ToastContainer position="top-center" autoClose={3000} />
              {currentQuestion.optionA}
            </p>
            <p onClick={this.handleOptionsClick} className="option">
              {currentQuestion.optionB}
            </p>
          </div>
          <div className="options-container">
            <p onClick={this.handleOptionsClick} className="option">
              {currentQuestion.optionC}
            </p>
            <p onClick={this.handleOptionsClick} className="option">
              {currentQuestion.optionD}
            </p>
          </div>
          <div className="button-container">
            <button id="previous" onClick={this.handleButtonClick}>
              <Icon path={mdilArrowLeft} size={1} />
              Previous
            </button>
            <button id="next" onClick={this.handleButtonClick}>
              Next <Icon path={mdilArrowRight} size={1} />
            </button>
            <button id="quit" onClick={this.handleButtonClick}>
              Quit
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Play;

