import { History, FetchHistory } from "../models/historyModel.js";

const fetchHistoryData = async (req, res) => {
  try {
    // Get the current date and set time to the start of the day in UTC
    const now = new Date();
    const startOfDay = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );

    console.log("Current date and time:", now);
    console.log("Start of the day (UTC):", startOfDay);

    // Check if data has been fetched today
    let fetchHistory = await FetchHistory.findOne({
      date: {
        $gte: startOfDay,
        $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
      },
    }).populate("fetchedDocuments");

    if (fetchHistory) {
      console.log(
        "Data has already been fetched today:",
        fetchHistory.fetchedDocuments
      );
      return res.json(fetchHistory.fetchedDocuments); // Return the documents
    } else {
      // Fetch up to 3 new documents that haven't been fetched before
      const newDocuments = await History.find({ fetched: false })
        .sort({ date: 1 })
        .limit(3)
        .exec();

      // Debug: Log the new documents fetched
      console.log("New documents fetched:", newDocuments);

      if (newDocuments.length === 0) {
        console.log("No new documents to fetch.");
        return res.status(404).json({ message: "No new documents to fetch." });
      }

      // Mark the fetched documents as fetched
      const fetchedDocumentIds = newDocuments.map((doc) => doc._id);
      const updateResult = await History.updateMany(
        { _id: { $in: fetchedDocumentIds } },
        { $set: { fetched: true } }
      );

      // Debug: Log the update result
      console.log("Update result:", updateResult);

      // Save the fetch history
      fetchHistory = new FetchHistory({
        date: now, // Store the exact current date and time
        fetchedDocuments: fetchedDocumentIds,
      });
      await fetchHistory.save();

      console.log("Fetched new documents:", newDocuments);
      return res.json(newDocuments);
    }
  } catch (error) {
    console.error("Error fetching history data:", error);
    return res.status(500).json({ error: "Failed to fetch history data" });
  }
};

export default fetchHistoryData;
