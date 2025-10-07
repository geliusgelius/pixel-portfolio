import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./Taskbar.css";

const Taskbar = ({
  windows,
  activeWindow,
  onRestoreWindow,
  onStartClick,
  onEasterEgg,
  iconsLocked,
  onToggleIconsLock,
}) => {
  const { t, currentLanguage, switchLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState("00:00");
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartClick = (e) => {
    e.stopPropagation();
    onStartClick();

    // Пасхалка: 5 кликов за 2 секунды
    const now = Date.now();
    if (now - lastClickTime < 2000) {
      setClickCount((prev) => prev + 1);
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);

    if (clickCount >= 4) {
      onEasterEgg();
      setClickCount(0);
    }
  };

  const handleLanguageClick = (e) => {
    e.stopPropagation();
    setShowLanguageMenu((prev) => !prev);
  };

  const handleLanguageChange = (lang) => {
    switchLanguage(lang);
    setShowLanguageMenu(false);
  };

  const handleLockClick = (e) => {
    e.stopPropagation();
    onToggleIconsLock();
  };

  return (
    <div className="taskbar">
      <div className="start-button pixel-border" onClick={handleStartClick}>
        <span className="start-icon">★</span>
        {t("start")}
      </div>

      <div className="taskbar-items">
        {windows.map((window) => (
          <div
            key={window.id}
            className={`taskbar-item ${
              activeWindow === window.id ? "active" : ""
            }`}
            onClick={() => onRestoreWindow(window.id)}
          >
            <span className="taskbar-icon">{window.icon}</span>
            <span className="taskbar-title">{window.title}</span>
          </div>
        ))}
      </div>

      <div className="system-tray pixel-border-inset">
        {/* Кнопка блокировки значков */}
        <div className="lock-button-container">
          <button
            className={`lock-button ${iconsLocked ? "locked" : "unlocked"}`}
            onClick={handleLockClick}
            title={
              iconsLocked ? "Разблокировать значки" : "Заблокировать значки"
            }
          >
            <span className="lock-icon">{iconsLocked ? "🔒" : "🔓"}</span>
          </button>
        </div>

        <div className="language-selector">
          <div className="language-button" onClick={handleLanguageClick}>
            {currentLanguage === "ru" ? "RU" : "EN"}
          </div>

          {showLanguageMenu && (
            <div className="language-menu">
              <div
                className={`language-option ${
                  currentLanguage === "ru" ? "active" : ""
                }`}
                onClick={() => handleLanguageChange("ru")}
              >
                RU
              </div>
              <div
                className={`language-option ${
                  currentLanguage === "en" ? "active" : ""
                }`}
                onClick={() => handleLanguageChange("en")}
              >
                EN
              </div>
            </div>
          )}
        </div>

        <div className="tray-time">{currentTime}</div>
      </div>
    </div>
  );
};

export default Taskbar;
