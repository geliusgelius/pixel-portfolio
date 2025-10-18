import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import TetrisGame from "./TetrisGame";
import "./GamesFolder.css";

const GamesFolder = () => {
  const { t } = useLanguage();
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: "tetris",
      title: t("tetris"),
      description: t("tetrisDescription"),
      icon: "🧩",
      size: "2.3 MB",
      type: t("game"),
      component: <TetrisGame />,
    },
    {
      id: "comingSoon",
      title: t("comingSoon"),
      description: t("moreGamesComing"),
      icon: "🎮",
      size: "0 KB",
      type: t("folder"),
      component: (
        <div className="coming-soon">
          <div className="coming-soon-icon">🚧</div>
          <h3>{t("developmentInProgress")}</h3>
          <p>{t("newGamesComingSoon")}</p>
        </div>
      ),
    },
  ];

  const handleGameDoubleClick = (game) => {
    setSelectedGame(game);
  };

  const handleBack = () => {
    setSelectedGame(null);
  };

  if (selectedGame) {
    return (
      <div className="game-fullscreen">
        <div className="game-header">
          <button className="back-button" onClick={handleBack}>
            ← {}
          </button>
          <h3 className="game-title">
            <span className="game-icon">{selectedGame.icon}</span>
            {selectedGame.title}
          </h3>
        </div>
        <div className="game-content">{selectedGame.component}</div>
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
              <button className="view-btn active">{t("largeIcons")}</button>
              <button className="view-btn">{t("list")}</button>
              <button className="view-btn">{t("details")}</button>
            </div>
            <div className="folder-info">
              <span>{t("selectedObjects")}: 0</span>
              <span>{t("totalSize")}: 2.3 MB</span>
            </div>
          </div>

          <div className="games-grid">
            {games.map((game) => (
              <div
                key={game.id}
                className="game-file"
                onDoubleClick={() => handleGameDoubleClick(game)}
                title={`${game.title}\n${game.description}\n\n${t(
                  "doubleClickToLaunch"
                )}`}
              >
                <div className="file-icon">{game.icon}</div>
                <div className="file-name">{game.title}</div>
                <div className="file-type">{game.type}</div>
                <div className="file-size">{game.size}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="folder-statusbar">
        <div className="statusbar-left">
          <span>2 {t("objects")}</span>
        </div>
        <div className="statusbar-right">
          <span>{t("selectObjectForDescription")}</span>
        </div>
      </div>
    </div>
  );
};

export default GamesFolder;
