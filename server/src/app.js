const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const partyRoutes = require("./routes/partyRoutes");
const voteRoutes = require("./routes/voteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/votes", voteRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
