const mongoose = require('mongoose');

const connectDB = async () => {
  const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';
  try {
    const conn = await mongoose.connect(DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;