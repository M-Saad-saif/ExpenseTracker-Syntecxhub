const mongoose = require("mongoose");

const connectDB = async () => {
  const DB_URL =
    process.env.MONGODB_URI || "mongodb://localhost:27017/expense-tracker";
  try {
    await mongoose.connect(DB_URL);
    const host = mongoose.connection.host; // checing the URL string
    if (host.includes("mongodb.net")) {
      console.log(" Connected to: MongoDB Atlas (Cloud)");
    } else {
      console.log(" Connected to: Local MongoDB");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
