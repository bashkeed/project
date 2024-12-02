import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import dotenv from "dotenv";
import Item from "./models/historyModel.js";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

dotenv.config();
connectDB();
const PORT = process.env.PORT || 3001;

app.use("/api/auth", authRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/quiz", quizRoutes);

// GET route to fetch items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    console.log(items);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
