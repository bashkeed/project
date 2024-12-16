import { History, FetchHistory } from "../models/historyModel.js";

const fetchHistoryData = async (req, res) => {
  try {
    // Get the current date and set time to the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    // Check if data has been fetched today
    const fetchHistory = await FetchHistory.findOne({ date: today }).populate(
      "fetchedDocuments"
    );

    if (fetchHistory) {
      console.log(
        "Data has already been fetched today:",
        fetchHistory.fetchedDocuments
      );
      return res.json(fetchHistory.fetchedDocuments); // Return the documents
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

      // Normalize the date to store in the database
      const normalizedDate = new Date();
      normalizedDate.setHours(0, 0, 0, 0);

      // Save the fetch history
      const newFetchHistory = new FetchHistory({
        date: normalizedDate,
        fetchedDocuments: newDocuments.map((doc) => doc._id),
      });
      await newFetchHistory.save();

      console.log("Fetched new documents:", newDocuments);
      return res.json(newDocuments);
    }
  } catch (error) {
    console.error("Error fetching history data:", error);
    return res.status(500).json({ error: "Failed to fetch history data" });
  }
};

export default fetchHistoryData;
