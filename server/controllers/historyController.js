import { History, FetchHistory } from "../models/historyModel.js";

const fetchHistoryData = async (req, res) => {
  try {
    // Get the current date and set time to the start of the day
    const today = new Date();

    // Check if data has been fetched today
    const fetchHistory = await FetchHistory.findOne({ date: today }).populate(
      "fetchedDocuments"
    );
    console.log(FetchHistory);

    if (fetchHistory) {
      console.log(
        "Data has already been fetched today:",
        fetchHistory.fetchedDocuments
      );
      return fetchHistory.fetchedDocuments;
    } else {
      // Fetch up to 3 new documents, excluding previously fetched ones
      const previouslyFetchedIds = fetchHistory
        ? fetchHistory.fetchedDocuments.map((doc) => doc._id)
        : [];
      const newDocuments = await History.find({
        _id: { $nin: previouslyFetchedIds },
      })
        .limit(3)
        .exec();

      // Save the fetch history
      const newFetchHistory = new FetchHistory({
        date: today,
        fetchedDocuments: newDocuments.map((doc) => doc._id),
      });
      await newFetchHistory.save();

      console.log("Fetched new documents:", newDocuments);
      return res.json(newDocuments);
    }
  } catch (error) {
    console.error("Error fetching history data:", error);
    throw error;
  }
};
export default fetchHistoryData;
