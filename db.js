const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the URI in the environment variables.
 * The app is designed to keep running even if Mongo is briefly
 * unavailable — search history is a "nice to have", not a blocker
 * for core weather lookups.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't crash the whole server just because Mongo is down —
    // weather lookups can still work without history persistence.
  }
};

module.exports = connectDB;
