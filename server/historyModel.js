import mongoose from "mongoose";
// Example Mongoose model
const Item = mongoose.model(
  "Item",
  new mongoose.Schema({
    name: String,
    description: String,
  })
);
export default Item;
