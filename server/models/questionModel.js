// import mongoose from "mongoose";

// const questionSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   options: [{ type: String, required: true }],
//   correctAnswer: { type: String, required: true },
// });

// const Question = mongoose.model("Question", questionSchema);
// export default Question;
// models/questionModel.js

import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: [{ type: String, required: true }],
    correctAnswer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
