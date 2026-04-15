require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// connect DB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// schema
const gameSchema = new mongoose.Schema({
  player1: String,
  player2: String,
  rounds: Array,
  winner: String,
});

const Game = mongoose.model("Game", gameSchema);

// save
app.post("/save", async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.json({ message: "Saved" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get
app.get("/games", async (req, res) => {
  const games = await Game.find().sort({ _id: -1 });
  res.json(games);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});