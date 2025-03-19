"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const router = useRouter();

  const startGame = () => {
    if (player1.trim()) {
      const player2Name = player2.trim() ? player2 : "Computer";
      router.push(`/game?player1=${player1}&player2=${player2Name}`);
    } else {
      alert("Enter Player 1 name!");
    }
  };

  return (
    <div className="setup-container">
      <h1>Tic-Tac-Toe</h1>
      <input
        type="text"
        placeholder="Player 1 Name"
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
      />
      <input
        type="text"
        placeholder="Player 2 Name (Optional)"
        value={player2}
        onChange={(e) => setPlayer2(e.target.value)}
      />
      <button onClick={startGame}>Start Game</button>
    </div>
  );
}
