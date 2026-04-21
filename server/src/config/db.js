const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryMongo = null;

const connectWithUri = async (uri) => {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
  });
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/voting_system";

  try {
    await connectWithUri(mongoUri);
    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.warn("⚠ Local MongoDB connection failed:", error.message);
    console.warn("→ Falling back to in-memory MongoDB for development");

    try {
      memoryMongo = await MongoMemoryServer.create({
        binary: { version: "7.0.14" },
      });
      const memoryUri = memoryMongo.getUri("voting_system");
      await connectWithUri(memoryUri);
      console.log("✓ In-memory MongoDB connected");
    } catch (fallbackError) {
      console.error("✗ In-memory MongoDB fallback failed:", fallbackError.message);
      throw new Error("Database connection failed. Start MongoDB or provide a valid MONGO_URI.");
    }
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryMongo) {
    await memoryMongo.stop();
  }
};

module.exports = connectDB;
module.exports.closeDB = closeDB;
