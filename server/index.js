import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import dotenv from "dotenv";
import User from "./userModel.js";
import Item from "./historyModel.js";
import argon2 from 'argon2'

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


//login route
app.post('/login', async(req,res)=>{
    const { email, password } = req.body;



    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // Verify the password
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // If login is successful, store user information in session
      //req.session.email = email; // Store user info (customize as needed)

      res
        .status(200)
        .json({ message: "Login successful!", user: { email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});






// Signup Route
app.post("/signup", async (req, res) => {
  console.log("i am here");
  const { name, email, password } = req.body;

  // Simple validation
  if(!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "username, Email and password are required." });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: "Email is not valid" });
  }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Create new user with hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
    console.log("User created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});


// GET route to fetch items
app.get('/api/items', async (req, res) => {
    try {
      const items = await Item.find();
      console.log(items)
      res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
