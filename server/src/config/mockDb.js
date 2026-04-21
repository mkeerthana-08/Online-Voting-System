// Simple in-memory mock database for development without MongoDB
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(__dirname, "../../mock-data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory storage
let store = {
  users: [],
  parties: [],
  votes: [],
};

// Load data from files if they exist
const loadData = () => {
  try {
    const usersFile = path.join(DATA_DIR, "users.json");
    const partiesFile = path.join(DATA_DIR, "parties.json");
    const votesFile = path.join(DATA_DIR, "votes.json");

    if (fs.existsSync(usersFile)) {
      store.users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    }
    if (fs.existsSync(partiesFile)) {
      store.parties = JSON.parse(fs.readFileSync(partiesFile, "utf8"));
    }
    if (fs.existsSync(votesFile)) {
      store.votes = JSON.parse(fs.readFileSync(votesFile, "utf8"));
    }
  } catch (error) {
    console.warn("Could not load persisted data:", error.message);
  }
};

// Save data to files
const saveData = () => {
  try {
    fs.writeFileSync(
      path.join(DATA_DIR, "users.json"),
      JSON.stringify(store.users, null, 2)
    );
    fs.writeFileSync(
      path.join(DATA_DIR, "parties.json"),
      JSON.stringify(store.parties, null, 2)
    );
    fs.writeFileSync(
      path.join(DATA_DIR, "votes.json"),
      JSON.stringify(store.votes, null, 2)
    );
  } catch (error) {
    console.warn("Could not save data:", error.message);
  }
};

// Mock Models
class MockModel {
  static async save(data) {
    return data;
  }
}

class User extends MockModel {
  static async findOne(query) {
    return store.users.find((u) => {
      return Object.keys(query).every((key) => u[key] === query[key]);
    });
  }

  static async create(data) {
    const user = {
      _id: `id_${Date.now()}`,
      ...data,
      hasVoted: data.hasVoted || false,
      createdAt: new Date(),
    };
    store.users.push(user);
    saveData();
    return user;
  }

  static async findByIdAndUpdate(id, update) {
    const user = store.users.find((u) => u._id === id);
    if (user) {
      Object.assign(user, update);
      saveData();
    }
    return user;
  }
}

class Party extends MockModel {
  static async find() {
    return store.parties;
  }

  static async findOne(query) {
    return store.parties.find((p) => {
      return Object.keys(query).every((key) => p[key] === query[key]);
    });
  }

  static async findById(id) {
    return store.parties.find((p) => p._id === id);
  }

  static async create(data) {
    const party = {
      _id: `party_${Date.now()}`,
      ...data,
      voteCount: 0,
      createdAt: new Date(),
    };
    store.parties.push(party);
    saveData();
    return party;
  }

  static async findByIdAndUpdate(id, update) {
    const party = store.parties.find((p) => p._id === id);
    if (party) {
      Object.assign(party, update);
      saveData();
    }
    return party;
  }

  static async findByIdAndDelete(id) {
    const index = store.parties.findIndex((p) => p._id === id);
    if (index > -1) {
      const party = store.parties[index];
      store.parties.splice(index, 1);
      saveData();
      return party;
    }
    return null;
  }
}

class Vote extends MockModel {
  static async find() {
    return store.votes;
  }

  static async findOne(query) {
    return store.votes.find((v) => {
      return Object.keys(query).every((key) => v[key] === query[key]);
    });
  }

  static async create(data) {
    const vote = {
      _id: `vote_${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };
    store.votes.push(vote);
    saveData();
    return vote;
  }

  static async aggregate(pipeline) {
    // Simple aggregation for vote counts
    const result = [];
    const partyCounts = {};

    store.votes.forEach((v) => {
      if (!partyCounts[v.partyId]) {
        partyCounts[v.partyId] = 0;
      }
      partyCounts[v.partyId]++;
    });

    for (const partyId in partyCounts) {
      result.push({
        _id: partyId,
        count: partyCounts[partyId],
      });
    }

    return result;
  }
}

// Load existing data
loadData();

module.exports = {
  User,
  Party,
  Vote,
  connectDB: async () => {
    console.log("✓ Mock database initialized (in-memory with file persistence)");
  },
};
