const Party = require("../models/Party");
const Vote = require("../models/Vote");

const getParties = async (req, res) => {
  try {
    const parties = await Party.find().sort({ createdAt: 1 });
    return res.json(parties);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addParty = async (req, res) => {
  try {
    const { name, symbol, description } = req.body;

    if (!name || !symbol) {
      return res.status(400).json({ message: "name and symbol are required" });
    }

    const party = await Party.create({ name, symbol, description });
    return res.status(201).json(party);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Party already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
};

const updateParty = async (req, res) => {
  try {
    const { partyId } = req.params;
    const { name, symbol, description } = req.body;

    const party = await Party.findByIdAndUpdate(
      partyId,
      { name, symbol, description },
      { new: true, runValidators: true }
    );

    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }

    return res.json(party);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteParty = async (req, res) => {
  try {
    const { partyId } = req.params;

    const voteExists = await Vote.findOne({ party: partyId });
    if (voteExists) {
      return res.status(400).json({ message: "Cannot delete a party with votes" });
    }

    const party = await Party.findByIdAndDelete(partyId);

    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }

    return res.json({ message: "Party deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getParties,
  addParty,
  updateParty,
  deleteParty,
};
