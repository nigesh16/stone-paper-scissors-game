import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import stone from "./assets/stone.png";
import paper from "./assets/papers.png";
import scissors from "./assets/Scissors.jpg";
import icon from "./assets/Center-img.png";
import bg from "./assets/Background-img.png";

import { User, History} from "lucide-react";
import { GoArrowRight } from "react-icons/go";

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
      <div className="h-screen" style={{backgroundImage: `url(${bg})`}}>
        <div className="bg-gray-900 text-white py-3 text-center text-[28px] h-[70px] font-bold">
          🎮 Stone Paper Scissors
        </div>
          
        <div className="flex justify-center"
        >
          <div className="mt-16 bg-white px-10 rounded-[18px] shadow-xl w-[420px] text-center h-[490px] pt-4">
            <img className="w-[130px] inline" src={icon} alt="" />

            <h2 className="text-[23px] font-bold mb-1">Enter Player Names</h2>
            <p className="text-[15px] mb-5 text-gray-500">Add to Players to start the game</p>

            <div className="flex w-full mb-3 ">
                  <User className="text-purple-600 h-11 border-2 border-r-0 w-12 px-[10px] rounded-l-xl" />
                  <input
                    className="border-2 border-l-0 py-2 w-full rounded-r-xl outline-none"
                    placeholder="Player 1"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                  />
            </div>

            <div className="flex w-full mb-4 ">
                  <User className="text-purple-600 h-11 border-2 border-r-0 w-12 px-[10px] rounded-l-xl" />
                  <input
                    className="border-2 border-l-0 py-2 w-full rounded-r-xl outline-none"
                    placeholder="Player 2"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                  />
            </div>

            <button
              className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-blue-500 text-[17px] text-white h-12 px-4 py-2 rounded-lg w-full font-medium"
              onClick={() => setStart(true)}
            >
              Start Game <GoArrowRight className="w-5 h-6 inline pb-1 " />
            </button>

            <div className="border-b-2 w-[85%] mt-6 mx-auto"></div>
            <p className="bg-white w-10 mx-auto relative -top-3 text-[13px] font-medium text-gray-500">OR</p>

            <button
              className="text-indigo-600"
              onClick={() => navigate("/history")}
            >
              <History className="w-5 h-5 inline mr-1" />
              <span className="pt-2 text-[14px] font-medium">View History</span> 
            </button>
          </div>
        </div>
      </ div>
    );
  }

  // GAME SCREEN
  return (
    <div className="h-screen" style={{backgroundImage: `url(${bg})`}}>
      <div className="bg-gray-900 text-white py-3 text-center text-[28px] h-[70px] font-bold">
        🎮 Stone Paper Scissors
      </div>

      <div className="p-6 text-center">

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
              className={`w-20 cursor-pointer border-2 rounded-[50%] ${
                choice1 === o ? "border-green-500" : "border-transparent"
              }`}
              onClick={() => setChoice1(o)}
            />
          ))}
        </div>

        <h2 className="font-semibold">{name2}</h2>
        <div className="flex justify-center gap-4 mb-4 ">
          {Object.keys(options).map((o) => (
            <img
              key={o}
              src={options[o]}
              alt={o}
              className={`w-20 cursor-pointer border-2 rounded-[50%] ${
                choice2 === o ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setChoice2(o)}
            />
          ))}
        </div>

        <button
          className="bg-gradient-to-r from-green-600 to-green-500 bg-green-500 text-[15px] text-white h-10 px-4 py-2 rounded-lg font-medium"
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
    </ div>
  );
}

export default App;