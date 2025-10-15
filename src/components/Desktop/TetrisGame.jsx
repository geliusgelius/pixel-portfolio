import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./TetrisGame.css";

const TetrisGame = () => {
  const { t } = useLanguage();

  // Константы игры
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;

  // Фигуры тетриса
  const TETROMINOES = {
    I: {
      shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      color: "#ff1493",
    },
    J: {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      color: "#ff69b4",
    },
    L: {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      color: "#db7093",
    },
    O: {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: "#ffb6c1",
    },
    S: {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      color: "#c71585",
    },
    T: {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      color: "#ff1493",
    },
    Z: {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      color: "#ff69b4",
    },
  };

  const TETROMINO_NAMES = Object.keys(TETROMINOES);

  // Состояние игры
  const [board, setBoard] = useState(createEmptyBoard());
  const [player, setPlayer] = useState(createNewPlayer());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Ref для актуального состояния паузы
  const isPausedRef = useRef(isPaused);
  const isPlayingRef = useRef(isPlaying);

  // Обновляем ref при изменении состояния
  useEffect(() => {
    isPausedRef.current = isPaused;
    isPlayingRef.current = isPlaying;
  }, [isPaused, isPlaying]);

  // Создание пустой доски
  function createEmptyBoard() {
    return Array(BOARD_HEIGHT)
      .fill()
      .map(() => Array(BOARD_WIDTH).fill(0));
  }

  // Создание нового игрока
  function createNewPlayer() {
    const randTetromino =
      TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
    return {
      pos: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      tetromino: TETROMINOES[randTetromino].shape,
      color: TETROMINOES[randTetromino].color,
    };
  }

  // Проверка столкновений
  const checkCollision = useCallback((pos, tetromino, board) => {
    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        if (tetromino[y][x] !== 0) {
          const boardX = pos.x + x;
          const boardY = pos.y + y;

          // Проверка границ
          if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
            return true;
          }

          // Проверка столкновения с другими фигурами
          if (boardY >= 0 && board[boardY][boardX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Поворот фигуры
  const rotate = (matrix, dir) => {
    // Транспонирование матрицы
    const rotated = matrix.map((_, index) => matrix.map((col) => col[index]));
    // Реверс для поворота
    if (dir > 0) return rotated.map((row) => row.reverse());
    return rotated.reverse();
  };

  // Движение игрока
  const movePlayer = useCallback(
    (dir) => {
      if (!isPlaying || gameOver || isPaused) return;

      setPlayer((prev) => {
        const newPos = { x: prev.pos.x + dir.x, y: prev.pos.y + dir.y };

        if (!checkCollision(newPos, prev.tetromino, board)) {
          return { ...prev, pos: newPos };
        }

        // Если движение вниз и есть столкновение - фиксируем фигуру
        if (dir.y > 0) {
          // Фиксируем текущую фигуру на доске
          const newBoard = board.map((row) => [...row]);
          prev.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
              if (value !== 0) {
                const boardY = prev.pos.y + y;
                const boardX = prev.pos.x + x;
                if (
                  boardY >= 0 &&
                  boardY < BOARD_HEIGHT &&
                  boardX >= 0 &&
                  boardX < BOARD_WIDTH
                ) {
                  newBoard[boardY][boardX] = {
                    value: 1,
                    color: prev.color,
                  };
                }
              }
            });
          });

          setBoard(newBoard);

          // Создаем новую фигуру и проверяем game over
          const newPlayer = createNewPlayer();

          // Проверяем, может ли новая фигура появиться
          if (checkCollision(newPlayer.pos, newPlayer.tetromino, newBoard)) {
            setIsPlaying(false);
            setGameOver(true);
            return prev;
          }

          return newPlayer;
        }

        return prev;
      });
    },
    [isPlaying, gameOver, isPaused, board, checkCollision]
  );

  // Поворот игрока
  const rotatePlayer = useCallback(() => {
    if (!isPlaying || gameOver || isPaused) return;

    setPlayer((prev) => {
      const rotated = rotate(prev.tetromino, 1);

      // Проверяем, можно ли повернуть
      if (!checkCollision(prev.pos, rotated, board)) {
        return { ...prev, tetromino: rotated };
      }

      // Пытаемся сдвинуть фигуру при столкновении
      const kicks = [1, -1, 2, -2];
      for (let kick of kicks) {
        const newPos = { ...prev.pos, x: prev.pos.x + kick };
        if (!checkCollision(newPos, rotated, board)) {
          return { ...prev, tetromino: rotated, pos: newPos };
        }
      }

      return prev;
    });
  }, [isPlaying, gameOver, isPaused, board, checkCollision]);

  // Быстрое падение
  const hardDrop = useCallback(() => {
    if (!isPlaying || gameOver || isPaused) return;

    setPlayer((prev) => {
      let newY = prev.pos.y;

      // Находим максимальную возможную позицию Y
      while (
        !checkCollision({ ...prev.pos, y: newY + 1 }, prev.tetromino, board)
      ) {
        newY++;
      }

      const finalPos = { ...prev.pos, y: newY };

      // Фиксируем фигуру после быстрого падения
      const newBoard = board.map((row) => [...row]);
      prev.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = finalPos.y + y;
            const boardX = finalPos.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              newBoard[boardY][boardX] = {
                value: 1,
                color: prev.color,
              };
            }
          }
        });
      });

      setBoard(newBoard);

      // Создаем новую фигуру и проверяем game over
      const newPlayer = createNewPlayer();

      if (checkCollision(newPlayer.pos, newPlayer.tetromino, newBoard)) {
        setIsPlaying(false);
        setGameOver(true);
        return prev;
      }

      return newPlayer;
    });
  }, [isPlaying, gameOver, isPaused, board, checkCollision]);

  // Проверка заполненных линий
  const sweepLines = useCallback(() => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.filter(
        (row) => !row.every((cell) => cell !== 0)
      );

      const linesCleared = BOARD_HEIGHT - newBoard.length;

      if (linesCleared > 0) {
        setScore((prev) => prev + linesCleared * 100 * level);
        setLevel((prev) => Math.min(prev + Math.floor(linesCleared / 2), 10));

        // Добавляем новые пустые строки сверху
        const emptyRows = Array(linesCleared)
          .fill()
          .map(() => Array(BOARD_WIDTH).fill(0));
        return [...emptyRows, ...newBoard];
      }

      return prevBoard;
    });
  }, [level]);

  // Автоматическое падение
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) return;

    const dropInterval = setInterval(() => {
      movePlayer({ x: 0, y: 1 });
    }, 1000 - (level - 1) * 80);

    return () => clearInterval(dropInterval);
  }, [isPlaying, gameOver, isPaused, level, movePlayer]);

  // Проверка заполненных линий после каждого обновления доски
  useEffect(() => {
    if (isPlaying && !gameOver) {
      sweepLines();
    }
  }, [board, isPlaying, gameOver, sweepLines]);

  // Управление с клавиатуры - ИСПРАВЛЕННАЯ ПАУЗА
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlayingRef.current || gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (!isPausedRef.current) movePlayer({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          e.preventDefault();
          if (!isPausedRef.current) movePlayer({ x: 1, y: 0 });
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isPausedRef.current) movePlayer({ x: 0, y: 1 });
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!isPausedRef.current) hardDrop();
          break;
        case " ":
          e.preventDefault();
          if (!isPausedRef.current) rotatePlayer();
          break;
        case "p":
        case "P":
          e.preventDefault();
          // Переключаем паузу используя актуальное состояние из ref
          setIsPaused((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer, rotatePlayer, hardDrop]); // Убраны зависимости isPlaying и isPaused

  // Начало игры
  const startGame = () => {
    setBoard(createEmptyBoard());
    setPlayer(createNewPlayer());
    setScore(0);
    setLevel(1);
    setIsPlaying(true);
    setGameOver(false);
    setIsPaused(false);
  };

  // Пауза/продолжение
  const togglePause = () => {
    if (isPlaying) {
      setIsPaused((prev) => !prev);
    }
  };

  // Рендер игрового поля
  const renderBoard = () => {
    const displayBoard = createEmptyBoard();

    // Копируем статичную доску
    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          displayBoard[y][x] = cell;
        }
      });
    });

    // Добавляем текущую фигуру игрока
    if (isPlaying && !gameOver) {
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = player.pos.y + y;
            const boardX = player.pos.x + x;

            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = {
                value: 1,
                color: player.color,
              };
            }
          }
        });
      });
    }

    return displayBoard;
  };

  return (
    <div className="tetris-game">
      <div className="tetris-header">
        <h3>{t("tetris")}</h3>
        <div className="tetris-stats">
          <div className="tetris-score">
            {t("tetrisScore")}
            {score}
          </div>
          <div className="tetris-level">
            {t("tetrisLevel")}
            {level}
          </div>
        </div>
      </div>

      <div className="tetris-content">
        <div className="tetris-board-container">
          <div className="tetris-board">
            {renderBoard().map((row, y) => (
              <div key={y} className="tetris-row">
                {row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className={`tetris-cell ${cell !== 0 ? "filled" : "empty"}`}
                    style={cell !== 0 ? { backgroundColor: cell.color } : {}}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="tetris-controls">
          {!isPlaying && !gameOver && (
            <button className="tetris-start-btn" onClick={startGame}>
              {t("tetrisStart")}
            </button>
          )}

          {gameOver && (
            <div className="tetris-game-over">
              <div className="game-over-text">{t("tetrisGameOver")}</div>
              <div className="final-score">
                {t("tetrisFinalScore")}
                {score}
              </div>
              <button className="tetris-restart-btn" onClick={startGame}>
                {t("tetrisRestart")}
              </button>
            </div>
          )}

          {isPlaying && (
            <div className="tetris-game-buttons">
              <button
                className={`tetris-pause-btn ${isPaused ? "paused" : ""}`}
                onClick={togglePause}
              >
                {isPaused ? t("tetrisContinue") : t("tetrisPause")}
              </button>
              <button className="tetris-drop-btn" onClick={hardDrop}>
                {t("tetrisHardDrop")} (↑)
              </button>
            </div>
          )}

          <div className="tetris-instructions">
            <p>
              <strong>{t("tetrisControlsTitle")}</strong>
            </p>
            <p>{t("tetrisControlsMove")}</p>
            <p>{t("tetrisControlsSoftDrop")}</p>
            <p>{t("tetrisControlsHardDrop")}</p>
            <p>{t("tetrisControlsRotate")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
