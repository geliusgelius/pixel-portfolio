import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./SnakeGame.css";

const COLS = 20;
const ROWS = 20;
const CELL = 20;
const SPEED = 150;

const OPPOSITE = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

function randomFood(snake) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

function initState() {
  const snake = [{ x: 10, y: 10 }];
  return { snake, food: randomFood(snake), dir: "RIGHT", nextDir: "RIGHT", score: 0 };
}

export default function SnakeGame() {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState("idle"); // idle | running | paused | over
  const [renderTick, setRenderTick] = useState(0); // just to trigger re-render

  const stateRef = useRef(initState());
  const intervalRef = useRef(null);
  const gameStateRef = useRef("idle");

  gameStateRef.current = gameState;

  const forceRender = useCallback(() => setRenderTick((n) => n + 1), []);

  const stopLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (gameStateRef.current !== "running") return;

    const gs = stateRef.current;
    gs.dir = gs.nextDir;

    const head = gs.snake[0];
    let nx = head.x, ny = head.y;
    if (gs.dir === "UP") ny -= 1;
    else if (gs.dir === "DOWN") ny += 1;
    else if (gs.dir === "LEFT") nx -= 1;
    else if (gs.dir === "RIGHT") nx += 1;

    // Wall collision
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
      stopLoop();
      setGameState("over");
      return;
    }
    // Self collision
    if (gs.snake.some((s) => s.x === nx && s.y === ny)) {
      stopLoop();
      setGameState("over");
      return;
    }

    const newHead = { x: nx, y: ny };
    const ate = nx === gs.food.x && ny === gs.food.y;
    gs.snake = ate ? [newHead, ...gs.snake] : [newHead, ...gs.snake.slice(0, -1)];
    if (ate) {
      gs.score += 10;
      gs.food = randomFood(gs.snake);
    }

    forceRender();
  }, [stopLoop, forceRender]);

  const startLoop = useCallback(() => {
    stopLoop();
    intervalRef.current = setInterval(tick, SPEED);
  }, [tick, stopLoop]);

  const startGame = useCallback(() => {
    stopLoop();
    stateRef.current = initState();
    setGameState("running");
  }, [stopLoop]);

  const togglePause = useCallback(() => {
    setGameState((prev) => (prev === "running" ? "paused" : "running"));
  }, []);

  // Start/stop loop when gameState changes
  useEffect(() => {
    if (gameState === "running") startLoop();
    else stopLoop();
    return stopLoop;
  }, [gameState]); // eslint-disable-line

  // Keyboard handler
  useEffect(() => {
    const handleKey = (e) => {
      const gs = gameStateRef.current;
      if (gs !== "running" && gs !== "paused") return;

      if (e.code === "KeyP") {
        togglePause();
        e.preventDefault();
        return;
      }
      if (gs !== "running") return;

      const map = {
        ArrowUp: "UP", KeyW: "UP",
        ArrowDown: "DOWN", KeyS: "DOWN",
        ArrowLeft: "LEFT", KeyA: "LEFT",
        ArrowRight: "RIGHT", KeyD: "RIGHT",
      };
      const newDir = map[e.code];
      if (!newDir) return;
      e.preventDefault();
      if (newDir !== OPPOSITE[stateRef.current.dir]) {
        stateRef.current.nextDir = newDir;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", handleKey, { capture: true });
    return () => window.removeEventListener("keydown", handleKey, { capture: true });
  }, [togglePause]);

  const { snake, food, score } = stateRef.current;

  return (
    <div className="snake-wrapper">
      <div className="snake-header">
        <span className="snake-score">{t("snakeScore")}{score}</span>
        {gameState === "running" && (
          <button className="snake-btn" onClick={togglePause}>{t("snakePause")}</button>
        )}
        {gameState === "paused" && (
          <button className="snake-btn" onClick={togglePause}>{t("snakeContinue")}</button>
        )}
      </div>

      <div className="snake-board-wrap">
        <div className="snake-board" style={{ width: COLS * CELL, height: ROWS * CELL }}>

          {/* Food */}
          <div
            className="snake-food"
            style={{ left: food.x * CELL, top: food.y * CELL, width: CELL, height: CELL }}
          />

          {/* Snake segments */}
          {snake.map((seg, i) => (
            <div
              key={i}
              className={`snake-seg${i === 0 ? " snake-head" : ""}`}
              style={{ left: seg.x * CELL, top: seg.y * CELL, width: CELL, height: CELL }}
            />
          ))}

          {/* Overlays */}
          {gameState === "idle" && (
            <div className="snake-overlay">
              <h3>{t("snake")}</h3>
              <p className="snake-controls-hint">
                {t("snakeControlsTitle")}<br />{t("snakeControlsMove")}
              </p>
              <button className="snake-start-btn" onClick={startGame}>{t("snakeStart")}</button>
            </div>
          )}
          {gameState === "over" && (
            <div className="snake-overlay">
              <h3>{t("snakeGameOver")}</h3>
              <p>{t("snakeFinalScore")}{score}</p>
              <button className="snake-start-btn" onClick={startGame}>{t("snakeRestart")}</button>
            </div>
          )}
          {gameState === "paused" && (
            <div className="snake-overlay">
              <h3>⏸</h3>
              <button className="snake-start-btn" onClick={togglePause}>{t("snakeContinue")}</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile controls */}
      <div className="snake-mobile-controls">
        <div className="snake-mobile-row">
          <button className="snake-mobile-btn" onTouchStart={(e) => {
            e.preventDefault();
            if (stateRef.current.dir !== "DOWN") stateRef.current.nextDir = "UP";
          }}>↑</button>
        </div>
        <div className="snake-mobile-row">
          <button className="snake-mobile-btn" onTouchStart={(e) => {
            e.preventDefault();
            if (stateRef.current.dir !== "RIGHT") stateRef.current.nextDir = "LEFT";
          }}>←</button>
          <button className="snake-mobile-btn" onTouchStart={(e) => {
            e.preventDefault();
            if (stateRef.current.dir !== "UP") stateRef.current.nextDir = "DOWN";
          }}>↓</button>
          <button className="snake-mobile-btn" onTouchStart={(e) => {
            e.preventDefault();
            if (stateRef.current.dir !== "LEFT") stateRef.current.nextDir = "RIGHT";
          }}>→</button>
        </div>
      </div>
    </div>
  );
}
