import { useEffect, useState } from "react";
import axios from "axios";
import bg from "./assets/Background-img.png";

const API = import.meta.env.VITE_API_URL;

function History() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get(`${API}/games`)
      .then(res => setGames(res.data));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-center" style={{backgroundImage: `url(${bg})`}} >
      <h1 className="text-2xl font-bold mb-6">Game History</h1>

      {games.length === 0 && <p>No games found</p>}

      <div className="space-y-4">
        {games.map((g, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <h2 className="font-bold">
              {g.player1} vs {g.player2}
            </h2>

            <p className="text-green-600 font-semibold">
              Winner: {g.winner}
            </p>

            <div className="text-sm mt-2">
              {g.rounds.map((r, idx) => (
                <p key={idx}>
                  Round {idx + 1}: {r.choice1} vs {r.choice2} → {r.result}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;