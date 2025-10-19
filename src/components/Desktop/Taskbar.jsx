import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import BackgroundSelector from "./BackgroundSelector";
import "./Taskbar.css";
import {
  MdiFullscreen,
  MdiPaletteOutline,
  MdiLockOutline,
  MdiLockOpenOutline,
  MdiLanguage,
} from "./icones";

const Taskbar = ({
  windows,
  activeWindow,
  onRestoreWindow,
  onStartClick,
  onEasterEgg,
  iconsLocked,
  onToggleIconsLock,
  currentTheme,
  onThemeChange,
}) => {
  const { t, currentLanguage, switchLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState("00:00");
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);

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

    // Easter Egg BSOD: 5 clicks in 2 seconds
    const now = Date.now();

    if (now - lastClickTime > 2000) {
      // Reset if more than 2 seconds have passed
      setClickCount(1);
    } else {
      // Increment counter
      const newCount = clickCount + 1;
      setClickCount(newCount);

      // Check for 5 clicks
      if (newCount >= 5) {
        onEasterEgg();
        setClickCount(0);
      }
    }

    setLastClickTime(now);
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

  const handleBackgroundClick = (e) => {
    e.stopPropagation();
    setShowBackgroundSelector(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="taskbar">
      <div className="start-button" onClick={handleStartClick}>
        <span className="start-icon">★</span>
        {t("start")}
      </div>

      <div className="taskbar-items">
        {}
        {(windows || []).map((window) => (
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

      <div className="system-tray">
        {/* Fullscreen button */}
        <div className="fullscreen-button-container">
          <button
            className="fullscreen-button"
            onClick={toggleFullscreen}
            title={t("fullscreen")}
          >
            <MdiFullscreen className="fullscreen-icon" />
          </button>
        </div>

        {/* Background change button */}
        <div className="background-button-container">
          <button
            className="background-button"
            onClick={handleBackgroundClick}
            title={t("changeBackground")}
          >
            <MdiPaletteOutline className="background-icon" />
          </button>
        </div>

        {/* Icon lock button */}
        <div className="lock-button-container">
          <button
            className={`lock-button ${iconsLocked ? "locked" : "unlocked"}`}
            onClick={handleLockClick}
            title={iconsLocked ? t("unlockIcons") : t("lockIcons")}
          >
            {iconsLocked ? (
              <MdiLockOutline className="lock-icon" />
            ) : (
              <MdiLockOpenOutline className="lock-icon" />
            )}
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

      {showBackgroundSelector && (
        <BackgroundSelector
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
          onClose={() => setShowBackgroundSelector(false)}
        />
      )}
    </div>
  );
};

export default Taskbar;
