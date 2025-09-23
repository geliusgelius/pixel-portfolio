import React, { useState } from "react";
import Taskbar from "./Taskbar";
import Window from "./Window";
import "./Desktop.css";

const Desktop = () => {
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  const openWindow = (title, icon, content) => {
    const id = Date.now().toString();
    const newWindow = {
      id,
      title,
      icon,
      content,
      position: { x: 50 + windows.length * 30, y: 50 + windows.length * 30 },
      size: { width: 600, height: 400 },
      isMinimized: false,
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindow(id);
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((window) => window.id !== id));
    if (activeWindow === id) {
      setActiveWindow(
        windows.length > 1 ? windows[windows.length - 2]?.id || null : null
      );
    }
  };

  const minimizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isMinimized: true } : window
      )
    );
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const restoreWindow = (id) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isMinimized: false } : window
      )
    );
    setActiveWindow(id);
  };

  const bringToFront = (id) => {
    setActiveWindow(id);
  };

  const updateWindowPosition = (id, position) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, position } : window
      )
    );
  };

  return (
    <div className="desktop">
      <div className="crt-effect">
        <div className="scanlines"></div>
        <div className="desktop-background">
          <div className="pixel-grid"></div>
          <div className="desktop-icons">
            <div
              className="desktop-icon"
              onClick={() => openWindow("About Me", "👤", <AboutMeContent />)}
            >
              <div className="icon">👤</div>
              <span>About Me</span>
            </div>

            <div
              className="desktop-icon"
              onClick={() => openWindow("Skills", "⚡", <SkillsContent />)}
            >
              <div className="icon">⚡</div>
              <span>Skills</span>
            </div>

            <div
              className="desktop-icon"
              onClick={() =>
                openWindow("Portfolio", "💼", <PortfolioContent />)
              }
            >
              <div className="icon">💼</div>
              <span>Portfolio</span>
            </div>

            <div
              className="desktop-icon"
              onClick={() => openWindow("Contact", "📧", <ContactContent />)}
            >
              <div className="icon">📧</div>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </div>

      {windows.map((window) => (
        <Window
          key={window.id}
          windowData={window}
          isActive={activeWindow === window.id}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onBringToFront={() => bringToFront(window.id)}
          onPositionChange={(position) =>
            updateWindowPosition(window.id, position)
          }
        />
      ))}

      <Taskbar
        windows={windows}
        activeWindow={activeWindow}
        onRestoreWindow={restoreWindow}
      />
    </div>
  );
};

const AboutMeContent = () => (
  <div className="window-content">
    <div className="pixel-avatar">👩‍💻</div>
    <h3>Angelina Smirnova</h3>
    <p>Frontend Developer</p>
    <div className="pixel-divider"></div>
    <p>
      Welcome to my pixel portfolio! I create amazing web experiences with
      modern technologies.
    </p>
  </div>
);

const SkillsContent = () => (
  <div className="window-content">
    <h3>Technical Skills</h3>
    <div className="skills-grid">
      <div className="skill-item">
        <span className="skill-icon">⚡</span>
        <span>React</span>
      </div>
      <div className="skill-item">
        <span className="skill-icon">🎨</span>
        <span>TypeScript</span>
      </div>
      <div className="skill-item">
        <span className="skill-icon">✨</span>
        <span>CSS3</span>
      </div>
      <div className="skill-item">
        <span className="skill-icon">🚀</span>
        <span>Vite</span>
      </div>
    </div>
  </div>
);

const PortfolioContent = () => (
  <div className="window-content">
    <h3>My Projects</h3>
    <div className="projects-list">
      <div className="project-item pixel-border">
        <h4>Pixel Art Generator</h4>
        <p>React + TypeScript</p>
      </div>
      <div className="project-item pixel-border">
        <h4>Retro Game</h4>
        <p>HTML5 Canvas</p>
      </div>
    </div>
  </div>
);

const ContactContent = () => (
  <div className="window-content">
    <h3>Get In Touch</h3>
    <div className="contact-info">
      <p>📧 email@example.com</p>
      <p>📱 +1234567890</p>
      <p>💼 GitHub: angelina-dev</p>
    </div>
  </div>
);

export default Desktop;
