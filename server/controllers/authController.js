import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import argon2 from "argon2";

export const login = async (req, res) => {
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

    // Create JWT token
    const token = jwt.sign({ userId: user._id, role:user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .json({ token,role:user.role})
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const signup = async (req, res) => {
  console.log("i am here also");
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
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
};
