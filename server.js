const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// LOWDB v1 setup
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

// Init DB
db.defaults({ leaderboard: [] }).write();

// Express app
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get leaderboard
app.get("/leaderboard", (req, res) => {
  const data = db.get("leaderboard").value();
  res.json(data);
});

// Update leaderboard
app.post("/leaderboard", (req, res) => {
  const { name, stats } = req.body;
  const existing = db.get("leaderboard").find({ name });

  if (existing.value()) {
    existing.assign({ stats }).write();
  } else {
    db.get("leaderboard").push({ name, stats }).write();
  }

  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
