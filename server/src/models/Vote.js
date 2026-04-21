const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteSchema);
