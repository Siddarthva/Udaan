import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

const DIFFICULTY_CONFIG = {
  easy: { gridSize: 3, shuffleMoves: 20, multiplier: 1 },
  medium: { gridSize: 4, shuffleMoves: 50, multiplier: 2 },
  hard: { gridSize: 5, shuffleMoves: 100, multiplier: 3 },
  expert: { gridSize: 6, shuffleMoves: 200, multiplier: 4 }
};

function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [difficulty, setDifficulty] = useState('medium');
  const [customGridSize, setCustomGridSize] = useState(4);
  const [board, setBoard] = useState([]);
  const [emptyPos, setEmptyPos] = useState({ row: 0, col: 0 });
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const timerRef = useRef(null);
  const gridSize = DIFFICULTY_CONFIG[difficulty].gridSize;

  // Load leaderboard from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('slidingPuzzleLeaderboard');
    if (stored) {
      setLeaderboard(JSON.parse(stored));
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);

  // Generate solved board
  const generateSolvedBoard = useCallback((size) => {
    const board = [];
    let num = 1;
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        if (i === size - 1 && j === size - 1) {
          row.push(0); // Empty tile
        } else {
          row.push(num++);
        }
      }
      board.push(row);
    }
    return board;
  }, []);

  // Shuffle board with valid moves
  const shuffleBoard = useCallback((board, size, shuffleMoves) => {
    let newBoard = board.map(row => [...row]);
    let emptyRow = size - 1;
    let emptyCol = size - 1;

    const directions = [
      { dr: -1, dc: 0 }, // up
      { dr: 1, dc: 0 },  // down
      { dr: 0, dc: -1 }, // left
      { dr: 0, dc: 1 }   // right
    ];

    for (let i = 0; i < shuffleMoves; i++) {
      const validMoves = directions.filter(({ dr, dc }) => {
        const newRow = emptyRow + dr;
        const newCol = emptyCol + dc;
        return newRow >= 0 && newRow < size && newCol >= 0 && newCol < size;
      });

      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      const newRow = emptyRow + randomMove.dr;
      const newCol = emptyCol + randomMove.dc;

      // Swap
      newBoard[emptyRow][emptyCol] = newBoard[newRow][newCol];
      newBoard[newRow][newCol] = 0;
      emptyRow = newRow;
      emptyCol = newCol;
    }

    return { board: newBoard, emptyPos: { row: emptyRow, col: emptyCol } };
  }, []);

  // Start new game
  const startGame = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const solvedBoard = generateSolvedBoard(config.gridSize);
    const { board: shuffledBoard, emptyPos: newEmptyPos } = shuffleBoard(
      solvedBoard,
      config.gridSize,
      config.shuffleMoves
    );

    setBoard(shuffledBoard);
    setEmptyPos(newEmptyPos);
    setMoves(0);
    setTime(0);
    setGameState('playing');
  }, [difficulty, generateSolvedBoard, shuffleBoard]);

  // Check if puzzle is solved
  const isSolved = useCallback((board) => {
    const size = board.length;
    let num = 1;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i === size - 1 && j === size - 1) {
          return board[i][j] === 0;
        }
        if (board[i][j] !== num++) {
          return false;
        }
      }
    }
    return true;
  }, []);

  // Check if a tile can be moved (is in same row or column as empty space)
  const isTileMovable = useCallback((row, col) => {
    return (row === emptyPos.row && col !== emptyPos.col) || 
           (col === emptyPos.col && row !== emptyPos.row);
  }, [emptyPos]);

  // Move tiles in a specific direction (LEFT, RIGHT, UP, DOWN)
  const moveDirection = useCallback((direction) => {
    if (isAnimating || gameState !== 'playing') return false;

    const size = board.length;
    let targetRow = emptyPos.row;
    let targetCol = emptyPos.col;

    // Determine which tile should move into the empty space
    switch (direction) {
      case 'LEFT':
        // Move tile from RIGHT into empty space (tile moves left, empty moves right)
        if (emptyPos.col < size - 1) {
          targetCol = emptyPos.col + 1;
        } else {
          return false;
        }
        break;
      case 'RIGHT':
        // Move tile from LEFT into empty space (tile moves right, empty moves left)
        if (emptyPos.col > 0) {
          targetCol = emptyPos.col - 1;
        } else {
          return false;
        }
        break;
      case 'UP':
        // Move tile from BELOW into empty space (tile moves up, empty moves down)
        if (emptyPos.row < size - 1) {
          targetRow = emptyPos.row + 1;
        } else {
          return false;
        }
        break;
      case 'DOWN':
        // Move tile from ABOVE into empty space (tile moves down, empty moves up)
        if (emptyPos.row > 0) {
          targetRow = emptyPos.row - 1;
        } else {
          return false;
        }
        break;
      default:
        return false;
    }

    // Perform the move
    setIsAnimating(true);
    const newBoard = board.map(r => [...r]);
    
    // Swap the target tile with the empty space
    newBoard[emptyPos.row][emptyPos.col] = newBoard[targetRow][targetCol];
    newBoard[targetRow][targetCol] = 0;

    setBoard(newBoard);
    setEmptyPos({ row: targetRow, col: targetCol });
    setMoves(m => m + 1);

    setTimeout(() => {
      setIsAnimating(false);
      
      // Check win condition
      if (isSolved(newBoard)) {
        setGameState('victory');
      }
    }, 200);

    return true;
  }, [board, emptyPos, isAnimating, gameState, isSolved]);

  // Move tile by clicking
  const moveTile = useCallback((row, col) => {
    if (isAnimating || gameState !== 'playing') return;

    const rowDiff = row - emptyPos.row;
    const colDiff = col - emptyPos.col;

    // Only allow moves if tile is in the same row or column as empty space
    if (row === emptyPos.row && col !== emptyPos.col) {
      // Same row - horizontal move
      slideMultipleTiles(row, col, 'horizontal');
    } else if (col === emptyPos.col && row !== emptyPos.row) {
      // Same column - vertical move
      slideMultipleTiles(row, col, 'vertical');
    }
  }, [emptyPos, isAnimating, gameState]);

  // Slide multiple tiles in a row or column when clicking
  const slideMultipleTiles = useCallback((row, col, direction) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newBoard = board.map(r => [...r]);
    let newEmptyPos = { ...emptyPos };

    if (direction === 'horizontal') {
      // Sliding tiles horizontally
      const step = col < emptyPos.col ? 1 : -1;

      // Shift all tiles between clicked tile and empty space
      for (let c = emptyPos.col; c !== col; c += step) {
        newBoard[row][c] = newBoard[row][c + step];
      }
      newBoard[row][col] = 0;
      newEmptyPos = { row, col };
    } else {
      // Sliding tiles vertically
      const step = row < emptyPos.row ? 1 : -1;

      // Shift all tiles between clicked tile and empty space
      for (let r = emptyPos.row; r !== row; r += step) {
        newBoard[r][col] = newBoard[r + step][col];
      }
      newBoard[row][col] = 0;
      newEmptyPos = { row, col };
    }

    setBoard(newBoard);
    setEmptyPos(newEmptyPos);
    setMoves(m => m + 1);

    setTimeout(() => {
      setIsAnimating(false);
      
      if (isSolved(newBoard)) {
        setGameState('victory');
      }
    }, 200);
  }, [board, emptyPos, isAnimating, isSolved]);

  // Keyboard controls - Arrow keys move tiles in that direction
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing' || isAnimating) return;

      let moved = false;

      switch (e.key) {
        case 'ArrowLeft':
          // LEFT arrow moves a tile LEFT (brings tile from right of empty space)
          moved = moveDirection('LEFT');
          break;
        case 'ArrowRight':
          // RIGHT arrow moves a tile RIGHT (brings tile from left of empty space)
          moved = moveDirection('RIGHT');
          break;
        case 'ArrowUp':
          // UP arrow moves a tile UP (brings tile from below empty space)
          moved = moveDirection('UP');
          break;
        case 'ArrowDown':
          // DOWN arrow moves a tile DOWN (brings tile from above empty space)
          moved = moveDirection('DOWN');
          break;
        default:
          break;
      }

      if (moved) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, isAnimating, moveDirection]);

  // Calculate score
  const calculateScore = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const score = 
      (config.gridSize * 1000) + 
      (config.multiplier * 500) - 
      (moves * 5) - 
      (time * 2);
    return Math.max(0, score);
  }, [difficulty, moves, time]);

  // Save score to leaderboard
  const saveScore = useCallback(() => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }

    const score = calculateScore();
    const newEntry = {
      name: playerName.trim(),
      gridSize: DIFFICULTY_CONFIG[difficulty].gridSize,
      difficulty,
      moves,
      time,
      score,
      date: new Date().toISOString()
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('slidingPuzzleLeaderboard', JSON.stringify(updatedLeaderboard));
    
    setPlayerName('');
    setGameState('menu');
  }, [playerName, calculateScore, difficulty, moves, time, leaderboard]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      {/* Main Menu */}
      {gameState === 'menu' && (
        <div className="menu">
          <h1 className="title">Sliding Puzzle</h1>
          
          <div className="settings">
            <div className="setting-group">
              <label>Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="select"
              >
                <option value="easy">Easy (3x3)</option>
                <option value="medium">Medium (4x4)</option>
                <option value="hard">Hard (5x5)</option>
                <option value="expert">Expert (6x6)</option>
              </select>
            </div>
          </div>

          <button onClick={startGame} className="btn btn-primary">
            Start Game
          </button>

          {/* Leaderboard */}
          <div className="leaderboard">
            <h2>Top 5 Leaderboard</h2>
            {leaderboard.length === 0 ? (
              <p className="empty-leaderboard">No scores yet. Be the first!</p>
            ) : (
              <div className="leaderboard-list">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`leaderboard-entry ${index === 0 ? 'best' : ''}`}
                  >
                    <div className="rank">#{index + 1}</div>
                    <div className="entry-details">
                      <div className="entry-name">{entry.name}</div>
                      <div className="entry-info">
                        {entry.gridSize}x{entry.gridSize} · {entry.difficulty} · {entry.moves} moves · {formatTime(entry.time)}
                      </div>
                    </div>
                    <div className="entry-score">{entry.score}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Screen */}
      {gameState === 'playing' && (
        <div className="game">
          <div className="game-header">
            <div className="stat">
              <span className="stat-label">Moves</span>
              <span className="stat-value">{moves}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Time</span>
              <span className="stat-value">{formatTime(time)}</span>
            </div>
          </div>

          <div className="controls-hint">
            <span>Use arrow keys ← → ↑ ↓ or click tiles to move</span>
          </div>

          <div className="board-container">
            <div 
              className="board" 
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
              }}
            >
              {board.map((row, rowIndex) =>
                row.map((tile, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`tile ${tile === 0 ? 'empty' : ''} ${
                      tile !== 0 && isTileMovable(rowIndex, colIndex) ? 'movable' : ''
                    }`}
                    onClick={() => moveTile(rowIndex, colIndex)}
                    style={{
                      gridRow: rowIndex + 1,
                      gridColumn: colIndex + 1
                    }}
                  >
                    {tile !== 0 && tile}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="game-controls">
            <button onClick={startGame} className="btn btn-secondary">
              Restart
            </button>
            <button onClick={() => setGameState('menu')} className="btn btn-secondary">
              Menu
            </button>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {gameState === 'victory' && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">🎉 Puzzle Solved!</h2>
            
            <div className="victory-stats">
              <div className="victory-stat">
                <span className="victory-stat-label">Time</span>
                <span className="victory-stat-value">{formatTime(time)}</span>
              </div>
              <div className="victory-stat">
                <span className="victory-stat-label">Moves</span>
                <span className="victory-stat-value">{moves}</span>
              </div>
              <div className="victory-stat">
                <span className="victory-stat-label">Score</span>
                <span className="victory-stat-value highlight">{calculateScore()}</span>
              </div>
            </div>

            <div className="name-input-group">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input"
                maxLength={20}
                onKeyPress={(e) => e.key === 'Enter' && saveScore()}
              />
            </div>

            <div className="modal-buttons">
              <button onClick={saveScore} className="btn btn-primary">
                Save Score
              </button>
              <button onClick={() => setGameState('menu')} className="btn btn-secondary">
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;