import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import Taskbar from "./Taskbar";
import Window from "./Window";
import StartMenu from "./StartMenu";
import EasterEgg from "./EasterEgg";
import ShutdownScreen from "./ShutdownScreen";
import Notification from "./Notification";
import "./Desktop.css";
import {
  TablerBrandHtml5,
  TablerBrandCss3,
  IxJavaScript,
  AkarIconsReactFill,
  Fa7BrandsNodeJs,
  MdiGithub,
  TeenyiconsTypescriptOutline,
  TablerBrandVite,
  MaterialSymbolsContentCopyOutline,
  MaterialSymbolsAttachEmailOutline,
  IconoirTelegram,
} from "./icones";

const Desktop = () => {
  const { t, currentLanguage } = useLanguage(); // Добавляем currentLanguage
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const openWindow = (title, icon, ContentComponent) => {
    const id = Date.now().toString();
    const newWindow = {
      id,
      title,
      icon,
      ContentComponent,
      position: { x: 50 + windows.length * 30, y: 50 + windows.length * 30 },
      size: { width: 600, height: 400 },
      isMinimized: false,
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindow(id);
    setShowStartMenu(false);
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
    setShowStartMenu(false);
  };

  const bringToFront = (id) => {
    setActiveWindow(id);
    setShowStartMenu(false);
  };

  const updateWindowPosition = (id, position) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, position } : window
      )
    );
  };

  const updateWindowSize = (id, size) => {
    setWindows((prev) =>
      prev.map((window) => (window.id === id ? { ...window, size } : window))
    );
  };

  const toggleStartMenu = () => {
    setShowStartMenu((prev) => !prev);
  };

  const activateEasterEgg = () => {
    setShowEasterEgg(true);
    setTimeout(() => setShowEasterEgg(false), 5000);
  };

  const handleShutdown = () => {
    setShowShutdown(true);
    setShowStartMenu(false);
  };

  const handleRestart = () => {
    setIsRestarting(true);
    setTimeout(() => {
      setShowShutdown(false);
      setIsRestarting(false);
      setWindows([]);
      setActiveWindow(null);

      setTimeout(() => {
        openWindow(t("aboutMeTitle"), "👤", AboutMeContent);
      }, 1000);
    }, 1000);
  };

  // Обновляем заголовки окон при смене языка
  const updateWindowTitles = () => {
    setWindows((prev) =>
      prev.map((window) => {
        let newTitle = window.title;

        // Обновляем заголовки на основе типа контента
        if (window.ContentComponent === AboutMeContent) {
          newTitle = t("aboutMeTitle");
        } else if (window.ContentComponent === SkillsContent) {
          newTitle = t("skillsTitle");
        } else if (window.ContentComponent === PortfolioContent) {
          newTitle = t("portfolioTitle");
        } else if (window.ContentComponent === ContactContent) {
          newTitle = t("contactTitle");
        }

        return { ...window, title: newTitle };
      })
    );
  };

  // Вызываем обновление заголовков при смене языка
  React.useEffect(() => {
    updateWindowTitles();
  }, [currentLanguage]);

  if (isRestarting) {
    return (
      <div className="restart-screen">
        <div className="restart-text">{t("restart")}</div>
      </div>
    );
  }

  return (
    <div className="desktop" onClick={() => setShowStartMenu(false)}>
      <div className="crt-effect">
        <div className="scanlines"></div>
        <div className="desktop-background">
          <div className="pixel-grid"></div>
          <div className="desktop-icons">
            <div
              className="desktop-icon"
              onClick={() =>
                openWindow(t("aboutMeTitle"), "👤", AboutMeContent)
              }
            >
              <div className="icon">👤</div>
              <span>{t("aboutMe")}</span>
            </div>

            <div
              className="desktop-icon"
              onClick={() => openWindow(t("skillsTitle"), "⚡", SkillsContent)}
            >
              <div className="icon">⚡</div>
              <span>{t("skills")}</span>
            </div>

            <div
              className="desktop-icon"
              onClick={() =>
                openWindow(t("portfolioTitle"), "💼", PortfolioContent)
              }
            >
              <div className="icon">💼</div>
              <span>{t("portfolio")}</span>
            </div>

            <div
              className="desktop-icon"
              onClick={() =>
                openWindow(t("contactTitle"), "📧", ContactContent)
              }
            >
              <div className="icon">📧</div>
              <span>{t("contact")}</span>
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
          onSizeChange={(size) => updateWindowSize(window.id, size)}
          currentLanguage={currentLanguage}
        />
      ))}

      <Taskbar
        windows={windows}
        activeWindow={activeWindow}
        onRestoreWindow={restoreWindow}
        onStartClick={toggleStartMenu}
        onEasterEgg={activateEasterEgg}
      />

      {showStartMenu && (
        <StartMenu
          onOpenWindow={openWindow}
          onClose={() => setShowStartMenu(false)}
          onShutdown={handleShutdown}
        />
      )}

      {showEasterEgg && <EasterEgg />}

      {showShutdown && <ShutdownScreen onRestart={handleRestart} />}
    </div>
  );
};

const AboutMeContent = () => {
  const { t } = useLanguage();
  return (
    <div className="window-content">
      <div className="pixel-avatar">👩‍💻</div>
      <h3>{t("name")}</h3>
      <p className="profession">{t("profession")}</p>
      <div className="pixel-divider"></div>
      {}
      <div className="welcome-text">{t("welcome")}</div>
    </div>
  );
};

const SkillsContent = () => {
  const { t } = useLanguage();
  return (
    <div className="window-content">
      <h3>{t("technicalSkills")}</h3>
      <div className="skills-grid">
        <div className="skill-item">
          <TablerBrandHtml5 style={{ fontSize: "32px", color: "#e44d26" }} />
          <span>HTML5</span>
        </div>
        <div className="skill-item">
          <TablerBrandCss3 style={{ fontSize: "32px", color: " #1572B6" }} />
          <span>CSS3</span>
        </div>
        <div className="skill-item">
          <IxJavaScript style={{ fontSize: "32px", color: " #D4B90F" }} />
          <span>Java Script</span>
        </div>
        <div className="skill-item">
          <AkarIconsReactFill style={{ fontSize: "32px", color: " #4BB8D9" }} />
          <span>React</span>
        </div>
        <div className="skill-item">
          <Fa7BrandsNodeJs style={{ fontSize: "32px", color: " #339933" }} />
          <span>Node.js</span>
        </div>
        <div className="skill-item">
          <MdiGithub style={{ fontSize: "32px", color: " #000000" }} />
          <span>Git</span>
        </div>
        <div className="skill-item">
          <TeenyiconsTypescriptOutline
            style={{ fontSize: "32px", color: " #3178C6" }}
          />
          <span>TypeScript</span>
        </div>

        <div className="skill-item">
          <TablerBrandVite style={{ fontSize: "32px", color: " #646CFF" }} />
          <span>Vite</span>
        </div>
      </div>
    </div>
  );
};

const PortfolioContent = () => {
  const { t } = useLanguage();
  return (
    <div className="window-content">
      <h3>{t("myProjects")}</h3>
      <div className="projects-list">
        <div className="project-item pixel-border">
          <h4>{t("pixelArtGenerator")}</h4>
          <p>React + TypeScript</p>
        </div>
        <div className="project-item pixel-border">
          <h4>{t("retroGame")}</h4>
          <p>HTML5 Canvas</p>
        </div>
      </div>
    </div>
  );
};

const ContactContent = () => {
  const { t } = useLanguage();
  const [showNotification, setShowNotification] = useState(false);

  // Кнопка для копирования email
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(t("email"));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      const textArea = document.createElement("textarea");
      textArea.value = t("email");
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="window-content">
      <h3>{t("getInTouch")}</h3>
      <div className="contact-info">
        <div className="contact-item">
          <MaterialSymbolsAttachEmailOutline className="contact-icon" />
          <span className="contact-text">{t("email")}</span>
          <button
            onClick={handleCopy}
            className="copy-btn"
            title="Скопировать email"
          >
            <MaterialSymbolsContentCopyOutline className="copy-icon" />
          </button>
        </div>
        <div className="contact-item">
          <IconoirTelegram className="contact-icon" />
          <a
            href={t("phoneUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            {t("phone")}
          </a>
        </div>
        <div className="contact-item">
          <MdiGithub className="contact-icon" />
          <a
            href={t("githubUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            {t("github")}
          </a>
        </div>
      </div>

      {}
      <Notification
        message="Email скопирован в буфер обмена! 📧"
        isVisible={showNotification}
        onClose={handleCloseNotification}
      />
    </div>
  );
};
export default Desktop;
