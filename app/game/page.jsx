'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function GameComponent() {
  const searchParams = useSearchParams();
  const player1 = searchParams.get('player1') || 'Player 1';
  const player2 = searchParams.get('player2') || 'Player 2';
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [mode, setMode] = useState(player2 === 'Computer' ? 'computer' : 'player');
  const [score, setScore] = useState({ X: 0, O: 0, Draw: 0 });

  useEffect(() => {
    startNewGame();
  }, [mode]);

  const fetchGameState = async () => {
    setIsFetching(true);
    try {
      const res = await fetch('/api/game');
      if (!res.ok) throw new Error('Session Expired');
      const data = await res.json();
      if (!data.gameState) {
        await startNewGame();
      } else {
        setBoard(data.gameState);
        setCurrentPlayer(data.currentPlayer);
        setWinner(data.winner);
        if (data.winner) {
          setScore((prev) => ({ ...prev, [data.winner]: prev[data.winner] + 1 }));
          alert(data.winner === 'Draw' ? 'Game Draw!' : `Congratulations! ${data.winner} Wins!`);
        }
      }
    } catch (error) {
      console.error(error.message);
      alert('Session Expired! Starting a new game.');
      await startNewGame();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchGameState();
  }, []);

  const handleClick = async (index) => {
    if (board[index] || winner || isFetching) return;
    setIsFetching(true);
    await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index, difficulty, mode }),
    });
    await fetchGameState();
  };

  const startNewGame = async () => {
    setIsFetching(true);
    await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newGame: true, difficulty, mode }),
    });
    await fetchGameState();
  };

  const restartGame = async () => {
    setIsFetching(true);
    await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newGame: true }),
    });
    await fetchGameState();
  };

  const renderCell = (index) => (
    <button key={index} className={`cell ${board[index]}`} onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  return (
    <div className="game-container">
      <h1 className="game-status">{winner ? (winner === 'Draw' ? 'Game Draw!' : `Winner: ${winner}`) : `Current Turn: ${currentPlayer}`}</h1>
      <div className="scoreboard">
        <p>{player1} Wins: {score.X}</p>
        <p>{player2} Wins: {score.O}</p>
        <p>Draws: {score.Draw}</p>
      </div>
      <div className="board">
        {board.map((_, index) => renderCell(index))}
      </div>
      <div className="controls">
        <label>Game Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)} disabled={isFetching}>
          <option value="player">Player vs Player</option>
          <option value="computer">Player vs Computer</option>
        </select>
      </div>
      {mode === 'computer' && (
        <div className="controls">
          <label>Difficulty Level:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))} disabled={isFetching}>
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
          </select>
        </div>
      )}
      <div className="button-group">
        <button onClick={restartGame} disabled={isFetching}>Restart</button>
        <button onClick={startNewGame} disabled={isFetching}>New Game</button>
      </div>
      <style jsx>{`
        .game-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          max-width: 500px;
          margin: auto;
        }
        .scoreboard p {
          margin: 5px 0;
        }
        .board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          margin: 20px 0;
        }
        .cell {
          width: 80px;
          height: 80px;
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #000;
          cursor: pointer;
        }
        .controls, .button-group {
          display: flex;
          gap: 10px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        @media (max-width: 500px) {
          .cell {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default GameComponent;
