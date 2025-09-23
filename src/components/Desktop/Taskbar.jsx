import React, { useState, useEffect } from "react";
import "./Taskbar.css";

const Taskbar = ({ windows, activeWindow, onRestoreWindow }) => {
  const [currentTime, setCurrentTime] = useState("00:00");

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

  return (
    <div className="taskbar">
      <div className="start-button pixel-border">
        <span className="start-icon">★</span>
        Start
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
        <div className="tray-time">{currentTime}</div>
      </div>
    </div>
  );
};

export default Taskbar;
