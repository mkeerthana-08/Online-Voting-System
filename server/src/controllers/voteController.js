const Party = require("../models/Party");
const User = require("../models/User");
const Vote = require("../models/Vote");

const castVote = async (req, res) => {
  try {
    const { partyId } = req.body;
    const userId = req.user.id;

    if (!partyId) {
      return res.status(400).json({ message: "partyId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.hasVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const existingVote = await Vote.findOne({ user: userId });
    if (existingVote) {
      user.hasVoted = true;
      await user.save();
      return res.status(400).json({ message: "You have already voted" });
    }

    const party = await Party.findById(partyId);
    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }

    await Vote.create({ user: userId, party: partyId });

    party.voteCount += 1;
    await party.save();

    user.hasVoted = true;
    await user.save();

    return res.status(201).json({ message: "Vote submitted successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already voted" });
    }
    return res.status(500).json({ message: error.message });
  }
};

const getVotes = async (req, res) => {
  try {
    const votes = await Vote.find()
      .populate("user", "name voterId")
      .populate("party", "name symbol")
      .sort({ createdAt: -1 });

    return res.json(votes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getVoteCount = async (req, res) => {
  try {
    const counts = await Party.find().select("name symbol voteCount").sort({ voteCount: -1 });
    return res.json(counts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyVoteStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("hasVoted");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ hasVoted: user.hasVoted });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  castVote,
  getVotes,
  getVoteCount,
  getMyVoteStatus,
};
