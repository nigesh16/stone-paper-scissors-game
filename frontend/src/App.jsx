import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import stone from "./assets/stone.png";
import paper from "./assets/papers.png";
import scissors from "./assets/Scissors.jpg";
const API = import.meta.env.VITE_API_URL;

const options = { stone, paper, scissors };

function getWinner(p1, p2) {
  if (p1 === p2) return "Tie";
  if (
    (p1 === "stone" && p2 === "scissors") ||
    (p1 === "scissors" && p2 === "paper") ||
    (p1 === "paper" && p2 === "stone")
  ) return "Player 1";
  return "Player 2";
}

function App() {
  const navigate = useNavigate();

  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [start, setStart] = useState(false);

  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");

  const [rounds, setRounds] = useState([]);

  const [showResult, setShowResult] = useState(false);
  const [finalWinner, setFinalWinner] = useState("");

  const handleRound = async () => {
    if (rounds.length >= 6) return;

    const result = getWinner(choice1, choice2);
    const newRounds = [...rounds, { choice1, choice2, result }];

    setRounds(newRounds);
    setChoice1("");
    setChoice2("");

    if (newRounds.length === 6) {
      const p1Score = newRounds.filter(r => r.result === "Player 1").length;
      const p2Score = newRounds.filter(r => r.result === "Player 2").length;

      const winner =
        p1Score > p2Score ? name1 :
        p2Score > p1Score ? name2 : "Tie";

      try {
        await axios.post(`${API}/save`, {
          player1: name1,
          player2: name2,
          rounds: newRounds,
          winner,
        });
      } catch (e) {
        console.log("Save error");
      }

      setFinalWinner(winner);

      setTimeout(() => {
        setShowResult(true);
      }, 50);

      return;
    }
  };

  // RESULT SCREEN
  if (showResult) {
    return (
      <>
        <div className="bg-black text-white py-3 text-center text-lg md:text-2xl font-bold">
          🎮 Stone Paper Scissors
        </div>

        <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
          <h1 className="text-4xl font-bold mb-6">
            🏆 Winner: {finalWinner}
          </h1>

          <button
            className="bg-white text-black px-6 py-2 rounded"
            onClick={() => {
              setShowResult(false);
              setStart(false);
              setName1("");
              setName2("");
              setRounds([]);
              setChoice1("");
              setChoice2("");
            }}
          >
            Play Again
          </button>
        </div>
      </>
    );
  }

  // NAME INPUT
  if (!start) {
    return (
      <>
        <div className="bg-black text-white py-3 text-center text-lg md:text-2xl font-bold">
          🎮 Stone Paper Scissors
        </div>

        <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-6 rounded shadow w-80 text-center">
            <h2 className="text-xl font-bold mb-4">Enter Player Names</h2>

            <input
              className="border p-2 w-full mb-3"
              placeholder="Player 1"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
            />

            <input
              className="border p-2 w-full mb-3"
              placeholder="Player 2"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
            />

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              onClick={() => setStart(true)}
            >
              Start Game
            </button>

            <button
              className="mt-3 text-blue-600 underline"
              onClick={() => navigate("/history")}
            >
              View History
            </button>
          </div>
        </div>
      </>
    );
  }

  // GAME SCREEN
  return (
    <>
      <div className="bg-black text-white py-3 text-center text-lg md:text-2xl font-bold">
        🎮 Stone Paper Scissors
      </div>

      <div className="p-6 text-center">
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded mb-4"
          onClick={() => navigate("/history")}
        >
          View History
        </button>

        <h1 className="text-2xl font-bold mb-4">
          Round {rounds.length + 1}/6
        </h1>

        <h2 className="font-semibold">{name1}</h2>
        <div className="flex justify-center gap-4 mb-4">
          {Object.keys(options).map((o) => (
            <img
              key={o}
              src={options[o]}
              alt={o}
              className={`w-20 cursor-pointer border-2 ${
                choice1 === o ? "border-green-500" : "border-transparent"
              }`}
              onClick={() => setChoice1(o)}
            />
          ))}
        </div>

        <h2 className="font-semibold">{name2}</h2>
        <div className="flex justify-center gap-4 mb-4">
          {Object.keys(options).map((o) => (
            <img
              key={o}
              src={options[o]}
              alt={o}
              className={`w-20 cursor-pointer border-2 ${
                choice2 === o ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setChoice2(o)}
            />
          ))}
        </div>

        <button
          className="bg-green-500 text-white px-6 py-2 rounded"
          disabled={!choice1 || !choice2 || rounds.length >= 6}
          onClick={handleRound}
        >
          Submit Round
        </button>

        <div className="mt-6">
          <h3 className="font-bold">Scoreboard</h3>
          {rounds.map((r, i) => (
            <p key={i}>
              Round {i + 1}: {r.choice1} vs {r.choice2} → {r.result}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;