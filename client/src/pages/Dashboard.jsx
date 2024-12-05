import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../utils/api";
//import { ClipLoader } from "react-spinners"; // Import the loader
import LoaderDash from '../components/LoaderDash';
import confetti from "canvas-confetti";
import correct from "../assets/img/audio/correct.mp3";
import dragon from '../assets/img/audio/dragon.mp3';


const Dashboard = () => {
  const [cumulativeScore, setCumulativeScore] = useState(0);
  const [latestScore, setLatestScore] = useState(0);
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [historyOfTheDay, setHistoryOfTheDay] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
   const [isAudioAllowed, setIsAudioAllowed] = useState(false);
  const navigate = useNavigate();


 useEffect(() => {
  if(isAudioAllowed){
   const dashAudio = document.getElementById("dragon");
   if (dashAudio) {
     dashAudio.play().catch((error) => console.log(error));
   }
  }
 }, [isAudioAllowed]);

 const handleUserInteraction = () => {
   setIsAudioAllowed(true);
 };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          userProfileResponse,
          scoresResponse,
          leaderboardResponse,
          historyResponse,
        ] = await Promise.all([
          api.get("/user/user-profile"),
          api.get("/user/user-scores"),
          api.get("/user/leaderboard"),
          // api.get("/history/history"),
        ]);

        setUsername(userProfileResponse.data.username);
        setCumulativeScore(scoresResponse.data.cumulativeScore);
        setLatestScore(scoresResponse.data.latestScore);
        setLeaderboard(leaderboardResponse.data);
        // setHistoryOfTheDay(historyResponse.data);
         
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
        navigate("/login");
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false); // Hide the loader once data is fetched
      }
    };

    fetchData();
  }, [navigate]);

  
      
 
  

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setHistoryIndex((prevIndex) => (prevIndex + 1) % historyOfTheDay.length);
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, [historyOfTheDay.length]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = () => {
    setIsSidebarOpen(false);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

   const celebrateWithConfetti = () => {
     confetti({
       particleCount: 500,
       spread: 90,
       origin: { x: 0.5, y: 0.5 },
       colors: ["#ff0", "#0f0", "#f00", "#00f"],
     });
   };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      
       <LoaderDash/>
      </div>
    );
  }
 
  return (
     <div onClick={handleUserInteraction}>
    <div className="container-fluid vh-100 d-flex flex-column ">
      <audio id="correct" src={correct}></audio>
      <audio id="dragon" src={dragon}></audio>
   
      <div className="row flex-grow-1">
        <button className="btn btn-tertiary d-md-none" onClick={toggleSidebar}>
          ☰
        </button>
        <div
          className={`col-12 col-md-3 bg-secondary text-white p-4 sidebar ${
            isSidebarOpen ? "open" : ""
          }`}
        >
          <h2 className="mb-4 catchy-heading">👤 hi, {username}!</h2>

          <button
            className="btn btn-light mb-3 w-100 box"
            onClick={() => {
              setShowLeaderboard(false);
              handleMenuItemClick();
            }}
          >
            📜 History of the Day
          </button>
          <button
            className="btn btn-light mb-3 w-100 box"
            onClick={() => {
              setShowLeaderboard(true);
              handleMenuItemClick();
              celebrateWithConfetti();
              const correctAudio = document.getElementById("correct");
              correctAudio.play();
            }}
          >
            📈 Show Leaderboard
          </button>
          <button
            onClick={() => {
              handleStartQuiz();
              handleMenuItemClick();
            }}
            className="btn btn-primary mb-3 w-100 box"
          >
            Start Quiz
          </button>
          <button
            onClick={() => {
              handleLogout();
              handleMenuItemClick();
            }}
            className="btn btn-danger w-100 box"
          >
            Log Out
          </button>
        </div>
        <div className="col-12 col-md-9 p-4 content">
          <div className="card text-center shadow p-4">
            <div className="card-body">
              <h1 className="card-title mb-4 catchy-heading">
                {getGreeting()}!
              </h1>
              <p className="lead fanciful-paragraph">
                Welcome to your dashboard, here you can access your personalized
                learning resources and track your progress.
              </p>
              <hr className="my-4" />
              <div className="scores mb-4 fanciful-scores">
                <p className="card-text">
                  Cumulative Score: <strong>{cumulativeScore}</strong>
                </p>
                <p className="card-text">
                  Latest Score: <strong>{latestScore}</strong>
                </p>
              </div>

              <hr className="my-4" />
              {showLeaderboard ? (
                <>
                  <h2 className="mb-4">Leaderboard</h2>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Username</th>
                        <th scope="col">Total Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((user, index) => (
                        <tr key={user._id}>
                          <th scope="row">{index + 1}</th>
                          <td>{user.name}</td>
                          <td>{user.totalScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <TransitionGroup>
                  <CSSTransition
                    key={historyIndex}
                    timeout={500}
                    classNames="fade"
                  >
                    <div className="history-card fanciful-history-card">
                      <h2>Did you know ?</h2>
                      {/* <p>{historyOfTheDay[historyIndex]?.text}</p> */}
                    </div>
                  </CSSTransition>
                </TransitionGroup>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
};

export default Dashboard;
