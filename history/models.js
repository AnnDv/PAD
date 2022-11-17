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
});

const History = mongoose.model("History", HistorySchema);

module.exports = History;