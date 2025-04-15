const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectDB = async () => {
  if (!process.env.MONGO_URI_AUTH) {
    console.error('MongoDB URI is missing in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI_AUTH);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;