export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://learnfly-server.onrender.com/api";
