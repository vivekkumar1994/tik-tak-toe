import { NextResponse } from 'next/server';

let gameState = Array(9).fill(null);
let currentPlayer = 'X';
let winner = null;

const checkWinner = () => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];
  for (let [a, b, c] of lines) {
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return gameState[a];
    }
  }
  return gameState.every(cell => cell) ? 'Draw' : null;
};

const computerMove = () => {
  const availableMoves = gameState.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
  if (availableMoves.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    gameState[availableMoves[randomIndex]] = 'O';
    winner = checkWinner();
    if (!winner) currentPlayer = 'X';
  }
};

export async function GET() {
  return NextResponse.json({ gameState, currentPlayer, winner });
}

export async function POST(req) {
  const { index, newGame, mode } = await req.json();

  if (newGame) {
    gameState = Array(9).fill(null);
    currentPlayer = 'X';
    winner = null;
  } else if (gameState[index] === null && !winner) {
    gameState[index] = currentPlayer;
    winner = checkWinner();
    if (!winner) {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (mode === 'computer' && currentPlayer === 'O') {
        computerMove();
      }
    }
  }
  return NextResponse.json({ gameState, currentPlayer, winner });
}
