import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../utils/api";
import { ClipLoader } from "react-spinners"; // Import the loader

const Dashboard = () => {
  const [cumulativeScore, setCumulativeScore] = useState(0);
  const [latestScore, setLatestScore] = useState(0);
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(true); // State to manage loading
  const navigate = useNavigate();

  const historyOfTheDay = [
    "Nigeria is in the continent of Africa",
    "Abuja is the capital of Nigeria",
    "Nigeria is the most populous country in Africa",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userProfileResponse, scoresResponse, leaderboardResponse] =
          await Promise.all([
            api.get("/quiz/user-profile"),
            api.get("/quiz/user-scores"),
            api.get("/quiz/leaderboard"),
          ]);

        setUsername(userProfileResponse.data.username);
        setCumulativeScore(scoresResponse.data.cumulativeScore);
        setLatestScore(scoresResponse.data.latestScore);
        setLeaderboard(leaderboardResponse.data);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setHistoryIndex((prevIndex) => (prevIndex + 1) % historyOfTheDay.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [historyOfTheDay.length]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="container-fluid vh-100 d-flex flex-column rounded">
      <div className="row flex-grow-1">
        <div className="col-12 col-md-3 bg-secondary text-white p-4 sidebar">
          <h2 className="mb-4 catchy-heading">👤 Hi, {username}!</h2>

          <button
            className="btn btn-light mb-3 w-100"
            onClick={() => setShowLeaderboard(false)}
          >
            📜 History of the Day
          </button>
          <button
            className="btn btn-light mb-3 w-100"
            onClick={() => setShowLeaderboard(true)}
          >
            📈 Show Leaderboard
          </button>
          <button
            onClick={handleStartQuiz}
            className="btn btn-primary mb-3 w-100"
          >
            Start Quiz
          </button>
          <button onClick={handleLogout} className="btn btn-danger w-100">
            Log Out
          </button>
        </div>
        <div className="col-12 col-md-9 p-4 content">
          <div className="card text-center shadow p-4">
            <div className="card-body">
              <h1 className="card-title mb-4 catchy-heading">{username}!</h1>
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
                      <p>{historyOfTheDay[historyIndex]}</p>
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
  );
};

export default Dashboard;
