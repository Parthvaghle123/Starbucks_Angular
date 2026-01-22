const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/Parth2";

const Mongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); // Stop the app if MongoDB connection fails
  }
};

module.exports = Mongo;