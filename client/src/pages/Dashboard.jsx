import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import api from "../utils/api";
import LoaderDash from "../components/LoaderDash";
import confetti from "canvas-confetti";
import correct from "../assets/img/audio/correct.mp3";
import dragon from "../assets/img/audio/happy.mp3";
import WhatsAppIcon from "@mui/icons-material/WhatsApp"; // Importing the WhatsApp icon from MUI

const Dashboard = () => {
  const [cumulativeScore, setCumulativeScore] = useState(0);
  const [latestScore, setLatestScore] = useState(0);
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [historyOfTheDay, setHistoryOfTheDay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAudioAllowed, setIsAudioAllowed] = useState(false);
  const [scoreHistory, setScoreHistory] = useState([]); // New state for score history
  const [scoreHistoryVisible, setScoreHistoryVisible] = useState(false); // Toggle for score history
  const navigate = useNavigate();

  const leader = useRef(null);
  const history = useRef(null);
    const scoreHis3 = useRef(null);

  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAudioAllowed) {
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
          scoreHistoryResponse,
        ] = await Promise.all([
          api.get("/user/user-profile"),
          api.get("/user/user-scores"),
          api.get("/user/leaderboard"),
          api.get("/history"),
          api.get("/user/score-history"),
        ]);

        setUsername(userProfileResponse.data.username);
        setCumulativeScore(scoresResponse.data.cumulativeScore);
        setLatestScore(scoresResponse.data.latestScore);
        setLeaderboard(leaderboardResponse.data);
        setHistoryOfTheDay(historyResponse.data);
        setScoreHistory(scoreHistoryResponse.data);
        console.log("Score History Response:", scoreHistoryResponse.data); // Debugging
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Server error. Please try again after some time.");
        navigate("/login");
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
    } else if (currentHour < 16) {
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
        <LoaderDash />
      </div>
    );
  }

  return (
    <div onClick={handleUserInteraction}>
      <div className="container-fluid vh-100 d-flex flex-column rounded">
        <audio id="correct" src={correct}></audio>
        <audio id="dragon" src={dragon}></audio>

        <div className="row flex-grow-1">
          <button
            className="btn btn-tertiary d-md-none"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <div
            className={`col-12 col-md-3 bg-warning text-white p-4 sidebar ${
              isSidebarOpen ? "open" : ""
            }`}
          >
            <h2 className="mb-4 catchy-heading ">
              👤 hi, {username.toUpperCase()}!
            </h2>

            <button
              className="btn btn-primary mb-3 w-100 box"
              onClick={() => {
                setShowLeaderboard(false);
                setScoreHistoryVisible(false);
                handleMenuItemClick();
                scrollToSection(history);
              }}
            >
              📜 History of the Day
            </button>
            <button
              className="btn btn-primary mb-3 w-100 box "
              onClick={() => {
                setShowLeaderboard(true);
                setScoreHistoryVisible(false);
                handleMenuItemClick();
                celebrateWithConfetti();
                const correctAudio = document.getElementById("correct");
                correctAudio.play();
                scrollToSection(leader);
              }}
            >
              📈 Show Leaderboard
            </button>
            <button
              className="btn btn-primary mb-3 w-100 box"
              onClick={() => {
                setShowLeaderboard(false);
                setScoreHistoryVisible(true);
                handleMenuItemClick();
              }}
            >
              🕒 Show Score History
            </button>
            <button
              onClick={() => {
                handleStartQuiz();
                handleMenuItemClick();
              }}
              className="btn btn-primary mb-3 w-100 box"
            >
              🎯 Start Quiz
            </button>
            <button
              onClick={() => {
                handleLogout();
                handleMenuItemClick();
              }}
              className="btn btn-danger w-100 box"
            >
              ❌ Log Out
            </button>
          </div>
          <div className="col-12 col-md-9 p-4 bg-info rounded ml-2 content">
            <div className="card text-center shadow p-4 bg-white">
              <div className="card-body">
                <h1 className="card-title mb-4 catchy-heading">
                  {getGreeting()}!
                </h1>
                <div className="marquee-container bg-info text-white p-2 mt-1 rounded">
                  <marquee>
                    If you like this application, please consider financially
                    supporting the developer by contacting him via this number
                    +234 8068849042. Thank you. Zubair Bashir
                  </marquee>
                </div>

                <p className="lead fanciful-paragraph">
                  Welcome to your dashboard. Here you can access your
                  personalized learning resources and track your progress.
                </p>
                <hr className="my-4" />

                <div className="scores mb-4 fanciful-scores w-100 w-sm-auto px-3 ">
                  <p className="card-text no-wrap d-inline">
                    Total&nbsp;Score: <strong>{cumulativeScore}</strong>
                    {cumulativeScore >= 200 && (
                      <span className="star-animate"> ⭐🏆</span>
                    )}
                  </p>
                  <p className="card-text">
                    Latest Score: <strong>{latestScore}</strong>
                  </p>
                </div>
                <hr className="my-4" />

                {/* Render the appropriate section */}
                {showLeaderboard ? (
                  <>
                    <h2 className="mb-4 catchy-heading">Leaderboard</h2>
                    <div className="table-responsive">
                      <table
                        className="table table-bordered table-hover table-striped"
                        ref={leader}
                      >
                        <caption>
                          The star indicate a user with score above 200
                        </caption>
                        <thead className="thead-dark">
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
                              <td>{user.name.toUpperCase()}</td>
                              <td>
                                {user.totalScore}{" "}
                                {user.totalScore >= 200 && (
                                  <span className="star-animate"> ⭐</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : scoreHistoryVisible ? (
                  <div className="score-history">
                    <hr className="my-4" />
                    <h2 className="mb-4 catchy-heading">Score History</h2>
                    <div className="overflow-x-auto">
                      <table className="table table-bordered table-hover table-striped">
                        <caption>List of user's score history</caption>
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">Scores</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scoreHistory.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center">
                                No score history available.
                              </td>
                            </tr>
                          ) : (
                            scoreHistory.map((entry, index) => (
                              <tr key={entry.id || index}>
                                <th scope="row">
                                  {scoreHistory.length - index}
                                </th>
                                <td>
                                  {new Date(entry.date).toLocaleDateString()}
                                </td>
                                <td>{entry.totalScore}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <Carousel>
                    {historyOfTheDay.map((item, index) => (
                      <Carousel.Item key={index}>
                        <div
                          className="history-card fanciful-history-card bg-info"
                          ref={history}
                        >
                          <h2>Did you know?</h2>
                          <p>{item.text}</p>
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <a
        href="https://wa.me/2348068849042"
        className="whatsapp-float opacity-75 hover:opacity-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        Chat with the developer
        <WhatsAppIcon fontSize="large" />
      </a>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
