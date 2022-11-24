const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 0,
  },
  movies: {
    type: [String],
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
});

const History = mongoose.model("History", HistorySchema);

module.exports = History;