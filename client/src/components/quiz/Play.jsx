import React,{Component, Fragment} from "react";
import { Helmet } from "react-helmet";
import Icon from "@mdi/react";
import { mdilLightbulbOn, mdilArrowRight, mdilArrowLeft } from "@mdi/light-js";
import { mdiBatteryCharging } from "@mdi/js";
import questions from '../../questions.json'
 import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
import correct from '../../assets/img/audio/correct.mp3'
 import wrong from "../../assets/img/audio/wrong.mp3";
import nextprev from "../../assets/img/audio/next-prev.mp3";

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
    };
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
  }

  displayQuestions = () => {
    let { currentQuestionIndex, questions } = this.state;

    // Check if questions exist and are not empty
    if (questions && questions.length > 0 && questions.length != -1) {
      const currentQuestion = questions[currentQuestionIndex];
      const nextQuestion = questions[currentQuestionIndex + 1] || null; // Safeguard if nextQuestion is out of bounds
      const previousQuestion = questions[currentQuestionIndex - 1] || null; // Safeguard if previousQuestion is out of bounds
      const answer = currentQuestion.answer;

      // Update the state with the current question, previous/next questions, and answer
      this.setState({
        currentQuestion,
        nextQuestion,
        previousQuestion,
        answer,
      });
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
      }),()=>{
      this.displayQuestions(
        this.state.questions,
        this.state.currentQuestion,
        this.state.nextQuestion,
        this.state.previousQuestion
      )
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
      navigator.vibrate(pattern);
    } else {

       const wrong = document.getElementById("wrong");
       wrong.play()
       setTimeout(()=>{
       wrong.pause()
       wrong.currentTime=0
       },3000)
      this.wrongAnswer();
    }
  };

  render() {
    console.log(questions);
    const { currentQuestion } = this.state;
    return (
      <Fragment>
        <Helmet>
          <title>Quiz Page</title>
        </Helmet>

        <>
          <audio id="correct" src={correct}></audio>
          <audio id="wrong" src={wrong}></audio>
          <audio id="nextprev" src={nextprev}></audio>
        </>

        <div className="questions">
          <h2>Quiz Mode</h2>
          <div className="lifeline-container">
            <p>
              <span className="lifeline-icon">
                <Icon path={mdiBatteryCharging} size={1} />{" "}
                <span className="lifeline">2</span>
              </span>
            </p>
            <p>
              <span className="lifeline-icon">
                <Icon path={mdilLightbulbOn} size={1} />
                <span className="lifeline">5</span>
              </span>
            </p>
          </div>
          <div>
            <p>
              <span className="left" style={{ float: "right" }}>
                2:15 <span className="watch">⌚</span>
              </span>
              <span className="right">
                {currentQuestion + 1} of {questions.length}{" "}
              </span>
              <span className="lifeline"></span>
            </p>
          </div>
          <h5>{currentQuestion.question}</h5>
          {console.log(currentQuestion)}
          <div className="options-container">
            <p onClick={this.handleOptionsClick} className="option">
              <ToastContainer />
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
            <button>
              <Icon path={mdilArrowLeft} size={1} />
              Previous
            </button>
            <button>
              Next <Icon path={mdilArrowRight} size={1} />
            </button>
            <button>Quit</button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Play;

