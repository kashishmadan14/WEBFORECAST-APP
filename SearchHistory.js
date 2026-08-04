const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    temperature: {
      type: Number,
    },
    condition: {
      type: String,
    },
    searchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index to make "recent searches" queries fast.
searchHistorySchema.index({ searchedAt: -1 });

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
