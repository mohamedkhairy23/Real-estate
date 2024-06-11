import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  // Ensure that only the fields that are specified in our schema will be saved in our database.
  mongoose.set("strictQuery", true);

  // If the database already connected, don't connect again
  if (connected) {
    console.log("MongoDB is already connected...");
    return;
  }

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("Connected to MongoDB Successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
