const mongoose = require('mongoose');
const atlas_URL = "mongodb+srv://anus22hka_db_user:BvYeH6w6PgpH3sbr@cluster0.desil7g.mongodb.net/?appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(atlas_URL);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;