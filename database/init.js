// Database initialization script
// Run this script to initialize the database with default data

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unified_employee_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const initData = async () => {
  await connectDB();
  // Add initialization logic here
  console.log('Data initialized');
  process.exit();
};

initData();
