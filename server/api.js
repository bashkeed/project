// api.js
export const fetchDailyQuestions = async (token) => {
  try {
    const response = await fetch("http://127.0.0.1:3000/daily-questions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Assuming JWT or similar auth mechanism
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
