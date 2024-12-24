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
  fetched: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const FetchHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true, // Adding an index for better performance
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
