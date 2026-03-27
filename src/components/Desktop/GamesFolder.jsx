import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import TetrisGame from "./TetrisGame";
import MinesweeperGame from "./MinesweeperGame";
import SnakeGame from "./SnakeGame";
import "./GamesFolder.css";

const GamesFolder = () => {
  const { t, currentLanguage } = useLanguage();
  const [selectedGame, setSelectedGame] = useState(null);
  const [viewMode, setViewMode] = useState("icons"); // icons | list | details

  const games = [
    {
      id: "tetris",
      title: t("tetris"),
      description: t("tetrisDescription"),
      icon: "🧩",
      size: "2.3 MB",
      type: t("game"),
      component: <TetrisGame key="tetris" />,
    },
    {
      id: "minesweeper",
      title: t("minesweeper"),
      description: t("minesweeperDescription"),
      icon: "💣",
      size: "1.8 MB",
      type: t("game"),
      component: <MinesweeperGame key="minesweeper" />,
    },
    {
      id: "snake",
      title: t("snake"),
      description: t("snakeDescription"),
      icon: "🐍",
      size: "1.2 MB",
      type: t("game"),
      component: <SnakeGame key="snake" />,
    },
  ];

  // Восстанавливаем игру из localStorage при загрузке
  useEffect(() => {
    const savedGameId = localStorage.getItem("currentGameId");
    if (savedGameId) {
      const gameToRestore = games.find((game) => game.id === savedGameId);
      if (gameToRestore) setSelectedGame(gameToRestore);
    }
  }, []);

  // Сохраняем игру в localStorage
  useEffect(() => {
    if (selectedGame) localStorage.setItem("currentGameId", selectedGame.id);
    else localStorage.removeItem("currentGameId");
  }, [selectedGame]);

  // Обновляем игры при смене языка
  useEffect(() => {
    if (selectedGame) {
      const updatedGame = games.find((game) => game.id === selectedGame.id);
      if (updatedGame) setSelectedGame(updatedGame);
    }
  }, [currentLanguage, t]);

  const handleGameDoubleClick = (game) => setSelectedGame(game);
  const handleBack = () => setSelectedGame(null);

  if (selectedGame) {
    const gameComponent = games.find((g) => g.id === selectedGame.id)?.component;
    return (
      <div className="game-fullscreen">
        <div className="game-header">
          <button className="back-button" onClick={handleBack}>
            ← {t("back")}
          </button>
          <h3 className="game-title">
            <span className="game-icon">{selectedGame.icon}</span>
            {selectedGame.title}
          </h3>
        </div>
        <div className="game-content">{gameComponent}</div>
      </div>
    );
  }

  return (
    <div className="games-folder">
      <div className="folder-header">
        <div className="folder-toolbar">
          <div className="toolbar-group">
            <button className="toolbar-btn">{t("file")}</button>
            <button className="toolbar-btn">{t("edit")}</button>
            <button className="toolbar-btn">{t("view")}</button>
            <button className="toolbar-btn">{t("tools")}</button>
            <button className="toolbar-btn">{t("help")}</button>
          </div>
        </div>
        <div className="address-bar">
          <span className="address-path">
            {t("desktop")} → {t("games")}
          </span>
        </div>
      </div>

      <div className="folder-body">
        <div className="folder-sidebar">
          <div className="sidebar-section">
            <h4>{t("favorites")}</h4>
            <div className="sidebar-item">{t("desktop")}</div>
            <div className="sidebar-item">{t("downloads")}</div>
            <div className="sidebar-item">{t("recentPlaces")}</div>
          </div>
          <div className="sidebar-section">
            <h4>{t("thisPC")}</h4>
            <div className="sidebar-item">{t("localDiskC")}</div>
            <div className="sidebar-item">{t("localDiskD")}</div>
            <div className="sidebar-item">{t("devicesAndDrives")}</div>
          </div>
        </div>

        <div className="folder-content">
          <div className="content-header">
            <div className="view-options">
              <button
                className={`view-btn${viewMode === "icons" ? " active" : ""}`}
                onClick={() => setViewMode("icons")}
              >
                {t("largeIcons")}
              </button>
              <button
                className={`view-btn${viewMode === "list" ? " active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                {t("list")}
              </button>
              <button
                className={`view-btn${viewMode === "details" ? " active" : ""}`}
                onClick={() => setViewMode("details")}
              >
                {t("details")}
              </button>
            </div>
            <div className="folder-info">
              <span>{t("totalSize")}: 5.3 MB</span>
            </div>
          </div>

          {/* Icons view */}
          {viewMode === "icons" && (
            <div className="games-grid">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="game-file"
                  onDoubleClick={() => handleGameDoubleClick(game)}
                  title={`${game.title}\n${game.description}\n\n${t("doubleClickToLaunch")}`}
                >
                  <div className="file-icon">{game.icon}</div>
                  <div className="file-name">{game.title}</div>
                  <div className="file-type">{game.type}</div>
                  <div className="file-size">{game.size}</div>
                </div>
              ))}
            </div>
          )}

          {/* List view */}
          {viewMode === "list" && (
            <div className="games-list-view">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="game-list-item"
                  onDoubleClick={() => handleGameDoubleClick(game)}
                >
                  <span className="list-icon">{game.icon}</span>
                  <span className="list-name">{game.title}</span>
                </div>
              ))}
            </div>
          )}

          {/* Details view */}
          {viewMode === "details" && (
            <div className="games-details-view">
              <div className="details-header-row">
                <span className="details-col-icon"></span>
                <span className="details-col-name">{t("file")}</span>
                <span className="details-col-type">{t("details")}</span>
                <span className="details-col-size">{t("totalSize")}</span>
              </div>
              {games.map((game) => (
                <div
                  key={game.id}
                  className="game-details-item"
                  onDoubleClick={() => handleGameDoubleClick(game)}
                >
                  <span className="details-col-icon">{game.icon}</span>
                  <span className="details-col-name">{game.title}</span>
                  <span className="details-col-type">{game.type}</span>
                  <span className="details-col-size">{game.size}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="folder-statusbar">
        <div className="statusbar-left">
          <span>{games.length} {t("objects")}</span>
        </div>
        <div className="statusbar-right">
          <span>{t("selectObjectForDescription")}</span>
        </div>
      </div>
    </div>
  );
};

export default GamesFolder;
