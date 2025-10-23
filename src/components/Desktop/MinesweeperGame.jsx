import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./MinesweeperGame.css";

const MinesweeperGame = () => {
  const { t } = useLanguage();

  // Константы игры
  const BOARD_SIZE = 10;
  const MINES_COUNT = 15;

  // Состояние игры
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [minesLeft, setMinesLeft] = useState(MINES_COUNT);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Инициализация игрового поля
  const initializeBoard = useCallback(() => {
    const newBoard = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
          x: i,
          y: j,
        });
      }
      newBoard.push(row);
    }
    return newBoard;
  }, []);

  // Размещение мин
  const placeMines = useCallback((board, firstX, firstY) => {
    let minesPlaced = 0;
    const newBoard = JSON.parse(JSON.stringify(board));

    while (minesPlaced < MINES_COUNT) {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);

      // Не ставим мину на первую клетку и вокруг нее
      if (
        !newBoard[x][y].isMine &&
        Math.abs(x - firstX) > 1 &&
        Math.abs(y - firstY) > 1
      ) {
        newBoard[x][y].isMine = true;
        minesPlaced++;
      }
    }

    // Подсчет соседних мин
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        if (!newBoard[x][y].isMine) {
          let count = 0;
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const newX = x + dx;
              const newY = y + dy;
              if (
                newX >= 0 &&
                newX < BOARD_SIZE &&
                newY >= 0 &&
                newY < BOARD_SIZE &&
                newBoard[newX][newY].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[x][y].adjacentMines = count;
        }
      }
    }

    return newBoard;
  }, []);

  // Раскрытие клетки
  const revealCell = useCallback(
    (x, y) => {
      setBoard((prevBoard) => {
        const newBoard = JSON.parse(JSON.stringify(prevBoard));

        if (
          newBoard[x][y].isRevealed ||
          newBoard[x][y].isFlagged ||
          gameOver ||
          gameWon
        ) {
          return prevBoard;
        }

        newBoard[x][y].isRevealed = true;

        // Если это мина - игра окончена
        if (newBoard[x][y].isMine) {
          setGameOver(true);
          setIsRunning(false);
          // Показываем все мины
          for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
              if (newBoard[i][j].isMine) {
                newBoard[i][j].isRevealed = true;
              }
            }
          }
          return newBoard;
        }

        // Если клетка пустая - раскрываем соседей
        if (newBoard[x][y].adjacentMines === 0) {
          const queue = [[x, y]];
          const visited = new Set();
          visited.add(`${x},${y}`);

          while (queue.length > 0) {
            const [currentX, currentY] = queue.shift();

            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                const newX = currentX + dx;
                const newY = currentY + dy;

                if (
                  newX >= 0 &&
                  newX < BOARD_SIZE &&
                  newY >= 0 &&
                  newY < BOARD_SIZE &&
                  !visited.has(`${newX},${newY}`)
                ) {
                  visited.add(`${newX},${newY}`);
                  const cell = newBoard[newX][newY];

                  if (!cell.isFlagged && !cell.isRevealed) {
                    cell.isRevealed = true;

                    if (cell.adjacentMines === 0) {
                      queue.push([newX, newY]);
                    }
                  }
                }
              }
            }
          }
        }

        // Проверка победы
        checkWinCondition(newBoard);

        return newBoard;
      });
    },
    [gameOver, gameWon]
  );

  // Установка/снятие флага
  const toggleFlag = useCallback(
    (x, y, e) => {
      e.preventDefault();

      setBoard((prevBoard) => {
        const newBoard = JSON.parse(JSON.stringify(prevBoard));

        if (newBoard[x][y].isRevealed || gameOver || gameWon) {
          return prevBoard;
        }

        if (!newBoard[x][y].isFlagged && minesLeft === 0) {
          return prevBoard;
        }

        newBoard[x][y].isFlagged = !newBoard[x][y].isFlagged;
        setMinesLeft((prev) =>
          newBoard[x][y].isFlagged ? prev - 1 : prev + 1
        );

        // Проверка победы
        checkWinCondition(newBoard);

        return newBoard;
      });
    },
    [minesLeft, gameOver, gameWon]
  );

  // Проверка условия победы
  const checkWinCondition = useCallback((board) => {
    let unrevealedSafeCells = 0;
    let correctlyFlaggedMines = 0;

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const cell = board[x][y];
        if (!cell.isRevealed && !cell.isMine) {
          unrevealedSafeCells++;
        }
        if (cell.isMine && cell.isFlagged) {
          correctlyFlaggedMines++;
        }
      }
    }

    if (unrevealedSafeCells === 0 || correctlyFlaggedMines === MINES_COUNT) {
      setGameWon(true);
      setIsRunning(false);
    }
  }, []);

  // Обработчик клика по клетке
  const handleCellClick = useCallback(
    (x, y) => {
      if (gameOver || gameWon) return;

      if (isFirstClick) {
        setIsFirstClick(false);
        setIsRunning(true);
        const newBoard = placeMines(board, x, y);
        setBoard(newBoard);
        revealCell(x, y);
      } else {
        revealCell(x, y);
      }
    },
    [board, gameOver, gameWon, isFirstClick, placeMines, revealCell]
  );

  // Перезапуск игры
  const restartGame = () => {
    setBoard(initializeBoard());
    setGameOver(false);
    setGameWon(false);
    setIsFirstClick(true);
    setMinesLeft(MINES_COUNT);
    setTimer(0);
    setIsRunning(false);
  };

  // Таймер
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Инициализация при загрузке
  useEffect(() => {
    restartGame();
  }, []);

  // Рендер клетки
  const renderCell = (cell) => {
    let content = "";
    let className = "minesweeper-cell";

    if (cell.isRevealed) {
      className += " revealed";
      if (cell.isMine) {
        content = "💣";
        className += " mine";
      } else if (cell.adjacentMines > 0) {
        content = cell.adjacentMines;
        className += ` number-${cell.adjacentMines}`;
      }
    } else if (cell.isFlagged) {
      content = "🚩";
      className += " flagged";
    }

    return (
      <div
        className={className}
        onClick={() => handleCellClick(cell.x, cell.y)}
        onContextMenu={(e) => toggleFlag(cell.x, cell.y, e)}
        key={`${cell.x}-${cell.y}`}
      >
        {content}
      </div>
    );
  };

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="minesweeper-game">
      <div className="minesweeper-header">
        <h3>{t("minesweeper")}</h3>
        <div className="minesweeper-stats">
          <div className="minesweeper-mines">
            {t("minesweeperMines")}
            {minesLeft}
          </div>
          <div className="minesweeper-timer">
            {t("minesweeperTime")}
            {formatTime(timer)}
          </div>
        </div>
      </div>

      <div className="minesweeper-content">
        <div className="minesweeper-board-container">
          <div className="minesweeper-board">
            {board.map((row, x) => (
              <div key={x} className="minesweeper-row">
                {row.map((cell) => renderCell(cell))}
              </div>
            ))}
          </div>
        </div>

        <div className="minesweeper-controls">
          {(gameOver || gameWon) && (
            <div className="minesweeper-game-over">
              <div className="game-over-text">
                {gameOver ? t("minesweeperGameOver") : t("minesweeperYouWin")}
              </div>
              <div className="final-time">
                {t("minesweeperFinalTime")}
                {formatTime(timer)}
              </div>
              <button className="minesweeper-restart-btn" onClick={restartGame}>
                {t("minesweeperRestart")}
              </button>
            </div>
          )}

          {!gameOver && !gameWon && (
            <div className="minesweeper-game-buttons">
              <button className="minesweeper-restart-btn" onClick={restartGame}>
                {t("minesweeperNewGame")}
              </button>
            </div>
          )}

          <div className="minesweeper-instructions">
            <p>
              <strong>{t("minesweeperControlsTitle")}</strong>
            </p>
            <p>{t("minesweeperControlsLeftClick")}</p>
            <p>{t("minesweeperControlsRightClick")}</p>
            <p>{t("minesweeperControlsGoal")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinesweeperGame;
