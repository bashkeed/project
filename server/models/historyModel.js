import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const FetchHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  fetchedDocuments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "History",
    },
  ],
});

export const History = mongoose.model("History", HistorySchema);
export const FetchHistory = mongoose.model("FetchHistory", FetchHistorySchema);
