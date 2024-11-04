import mongoose from "mongoose";
const connectDB = () => {
  const uri = process.env.MONGO_URI;
  mongoose
.connect(uri, {
      dbname: "project",
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((error) => console.log("database connection failed!", error));
};
export default connectDB;
