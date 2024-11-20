// DailyQuestions.js
import React, { useEffect, useState } from "react";
import api from "../utils/api";

const DailyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await api.get("/question/daily-questions")
        console.log(data);
        
      } catch (err) {
        console.error(err);
        
        setError("Failed to load daily questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Daily Questions</h1>
      {questions.length > 0 ? (
        <ul>
          {questions.map((question) => (
            <li key={question._id}>
              <h2>{question.title}</h2>
              <p>{question.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available for today.</p>
      )}
    </div>
  );
};

export default DailyQuestions;
