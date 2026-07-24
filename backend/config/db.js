const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('⚠️ MongoDB connection failed — server running WITHOUT a database:', err.message);
    // Not calling process.exit(1) here so the server stays up for non-DB testing
  }
};

module.exports = connectDB;