const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  user_id: {
    type: Number,
    default: 0,
  },
  movies: {
    type: [String],
    required: true,
  },
});

const History = mongoose.model("History", HistorySchema);

module.exports = History;