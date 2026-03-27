import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { themes } from "../../utils/themes";
import Taskbar from "./Taskbar";
import Window from "./Window";
import StartMenu from "./StartMenu";
import EasterEgg from "./EasterEgg";
import ShutdownScreen from "./ShutdownScreen";
import Notification from "./Notification";
import DesktopIcon from "./DesktopIcon";
import BSOD from "./BSOD";
import Preloader from "../Preloader/Preloader";
import BackgroundSelector from "./BackgroundSelector";
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
  MaterialSymbolsAccountCircle,
  MdiLightningBolt,
  BytesizePortfolio,
  StreamlinePixelDesignColorPaintingPalette,
  MaterialSymbolsContactMailOutline,
  MaterialSymbolsFolderCopyOutline,
  MdiMountain,
  MdiFactory,
  MdiCakeVariant,
  MdiSpa,
  MdiGamepadVariant,
  MdiPalette,
  MdiViewColumn,
} from "./icones";
import GamesFolder from "./GamesFolder";

const Desktop = () => {
  const { t, currentLanguage } = useLanguage();
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [iconsLocked, setIconsLocked] = useState(false);
  const [iconPositions, setIconPositions] = useState({});
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("selectedTheme") || "pink";
  });
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    isVisible: false,
  });

  // СОСТОЯНИЕ ДЛЯ ВЫБРАННОЙ ИГРЫ
  const [selectedGame, setSelectedGame] = useState(null);

  // Начальные позиции для значков
  const defaultIconPositions = {
    aboutMe: { x: 20, y: 20 },
    skills: { x: 20, y: 120 },
    portfolio: { x: 20, y: 220 },
    photoEditor: { x: 20, y: 320 },
    contact: { x: 20, y: 420 },
    games: { x: 20, y: 520 },
  };

  // ВОССТАНОВЛЕНИЕ ВЫБРАННОЙ ИГРЫ ИЗ LOCALSTORAGE ПРИ ЗАГРУЗКЕ
  useEffect(() => {
    const savedGameId = localStorage.getItem("currentGameId");
    if (savedGameId) {
      // Создаем базовый объект игры для восстановления
      const restoredGame = {
        id: savedGameId,
        title: savedGameId === "tetris" ? t("tetris") : t("minesweeper"),
        icon: savedGameId === "tetris" ? "🧩" : "💣",
      };
      setSelectedGame(restoredGame);
    }
  }, []);

  // Функция для применения темы ко всему сайту
  const applyTheme = (themeId) => {
    const theme = themes[themeId] || themes.pink;
    const root = document.documentElement;

    root.style.setProperty("--theme-primary", theme.colors.primary);
    root.style.setProperty("--theme-secondary", theme.colors.secondary);
    root.style.setProperty("--theme-accent", theme.colors.accent);
    root.style.setProperty("--theme-background", theme.colors.background);
    root.style.setProperty("--theme-text", theme.colors.text);
    root.style.setProperty("--theme-border", theme.colors.border);
    root.style.setProperty("--theme-shadow", theme.colors.shadow);
    root.style.setProperty("--theme-text-inverted", theme.colors.textInverted);
  };

  // Применяем тему при загрузке и при изменении currentTheme
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Показ уведомлений
  const showNotification = (message) => {
    setNotification({ message, isVisible: true });
    setTimeout(() => {
      setNotification({ message: "", isVisible: false });
    }, 3000);
  };

  // Автоматически открываем окно "Обо мне" при загрузке
  useEffect(() => {
    const timer = setTimeout(() => {
      openWindow(
        t("aboutMeTitle"),
        <MaterialSymbolsAccountCircle style={{ fontSize: "1rem" }} />,
        AboutMeContent,
        "aboutMe"
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const openWindow = (title, icon, ContentComponent, windowType) => {
    const existingWindow = windows.find(
      (window) => window.windowType === windowType
    );

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        restoreWindow(existingWindow.id);
      } else {
        minimizeWindow(existingWindow.id);
      }
      setShowStartMenu(false);
      return;
    }

    const id = Date.now().toString();
    const newWindow = {
      id,
      title,
      icon,
      ContentComponent,
      windowType,
      position: { x: 50 + windows.length * 30, y: 50 + windows.length * 30 },
      size: { width: 600, height: 400 },
      isMinimized: false,
      isActive: true,
    };

    setWindows((prev) => [
      ...prev.map((w) => ({ ...w, isActive: false })),
      newWindow,
    ]);
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
        window.id === id
          ? { ...window, isMinimized: true, isActive: false }
          : window
      )
    );
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const restoreWindow = (id) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? { ...window, isMinimized: false, isActive: true }
          : window
      )
    );
    setActiveWindow(id);
    setShowStartMenu(false);
  };

  const bringToFront = (id) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? { ...window, isActive: true }
          : { ...window, isActive: false }
      )
    );
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
    setShowBSOD(true);
  };

  const handleBSODRestart = () => {
    setShowBSOD(false);
    setShowPreloader(true);

    setTimeout(() => {
      setShowPreloader(false);
      setWindows([]);
      setActiveWindow(null);
      setIconPositions({});
      setSelectedGame(null);
      localStorage.removeItem("currentGameId");

      setTimeout(() => {
        openWindow(
          t("aboutMeTitle"),
          <MaterialSymbolsAccountCircle style={{ fontSize: "1rem" }} />,
          AboutMeContent,
          "aboutMe"
        );
      }, 1000);
    }, 3000);
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
      setIconPositions({});
      setSelectedGame(null);
      localStorage.removeItem("currentGameId");

      setTimeout(() => {
        openWindow(
          t("aboutMeTitle"),
          <MaterialSymbolsAccountCircle style={{ fontSize: "1rem" }} />,
          AboutMeContent,
          "aboutMe"
        );
      }, 1000);
    }, 1000);
  };

  const handleIconPositionChange = (iconId, newPosition) => {
    setIconPositions((prev) => ({
      ...prev,
      [iconId]: newPosition,
    }));
  };

  const toggleIconsLock = () => {
    const newLockState = !iconsLocked;
    setIconsLocked(newLockState);
    showNotification(
      newLockState ? "Значки заблокированы" : "Значки разблокированы"
    );
  };

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("selectedTheme", newTheme);
    showNotification(`Тема изменена на: ${themes[newTheme]?.name || newTheme}`);
  };

  const updateWindowTitles = () => {
    setWindows((prev) =>
      prev.map((window) => {
        let newTitle = window.title;

        if (window.ContentComponent === AboutMeContent) {
          newTitle = t("aboutMeTitle");
        } else if (window.ContentComponent === SkillsContent) {
          newTitle = t("skillsTitle");
        } else if (window.ContentComponent === PortfolioContent) {
          newTitle = t("portfolioTitle");
        } else if (window.ContentComponent === ContactContent) {
          newTitle = t("contactTitle");
        } else if (window.ContentComponent === PhotoEditorContent) {
          newTitle = t("photoEditorTitle");
        } else if (window.ContentComponent === GamesContent) {
          newTitle = t("gamesTitle");
        }

        return { ...window, title: newTitle };
      })
    );
  };

  useEffect(() => {
    updateWindowTitles();
  }, [currentLanguage, t]);

  // ОБНОВЛЕНИЕ ВЫБРАННОЙ ИГРЫ ПРИ СМЕНЕ ЯЗЫКА
  useEffect(() => {
    if (selectedGame) {
      const updatedGame = {
        ...selectedGame,
        title: selectedGame.id === "tetris" ? t("tetris") : t("minesweeper"),
      };
      setSelectedGame(updatedGame);
    }
  }, [currentLanguage, t]);

  // КОМПОНЕНТЫ КОНТЕНТА ОКОН (ПЕРЕМЕЩЕНЫ ВНУТРЬ Desktop)
  const AboutMeContent = () => {
    const { t } = useLanguage();
    return (
      <div className="window-content">
        <div className="pixel-avatar">👩‍💻</div>
        <h3>{t("name")}</h3>
        <p className="profession">{t("profession")}</p>
        <div className="pixel-divider"></div>
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
            <TablerBrandCss3 style={{ fontSize: "32px", color: "#1572B6" }} />
            <span>CSS3</span>
          </div>
          <div className="skill-item">
            <IxJavaScript style={{ fontSize: "32px", color: "#D4B90F" }} />
            <span>JavaScript</span>
          </div>
          <div className="skill-item">
            <AkarIconsReactFill
              style={{ fontSize: "32px", color: "#4BB8D9" }}
            />
            <span>React</span>
          </div>
          <div className="skill-item">
            <Fa7BrandsNodeJs style={{ fontSize: "32px", color: "#339933" }} />
            <span>Node.js</span>
          </div>
          <div className="skill-item">
            <MdiGithub style={{ fontSize: "32px", color: "#000000" }} />
            <span>Git</span>
          </div>
          <div className="skill-item">
            <TeenyiconsTypescriptOutline
              style={{ fontSize: "32px", color: "#3178C6" }}
            />
            <span>TypeScript</span>
          </div>
          <div className="skill-item">
            <TablerBrandVite style={{ fontSize: "32px", color: "#646CFF" }} />
            <span>Vite</span>
          </div>
        </div>
      </div>
    );
  };

  const PortfolioContent = () => {
    const { t } = useLanguage();
    const clientProjects = [
      {
        key: "putorana",
        url: "https://xn----7sbb5bndbcbemtdn.xn--p1ai/",
        tags: ["HTML/CSS", "JavaScript", "PHP"],
        icon: <MdiMountain style={{ fontSize: "2rem", color: "var(--theme-primary)" }} />,
      },
      {
        key: "montazhAgro",
        url: "https://montazh-agro.ru/",
        tags: ["HTML/CSS", "JavaScript", "PHP"],
        icon: <MdiFactory style={{ fontSize: "2rem", color: "var(--theme-primary)" }} />,
      },
      {
        key: "bento68",
        url: "https://bento68.ru/",
        tags: ["HTML/CSS", "JavaScript", "PHP"],
        icon: <MdiCakeVariant style={{ fontSize: "2rem", color: "var(--theme-primary)" }} />,
      },
      {
        key: "vesna",
        url: "https://vesnapm.ru/",
        tags: ["HTML/CSS", "JavaScript", "PHP"],
        icon: <MdiSpa style={{ fontSize: "2rem", color: "var(--theme-primary)" }} />,
      },
    ];

    return (
      <div className="window-content">
        <h3>{t("clientProjects")}</h3>
        <div className="projects-list">
          {clientProjects.map((proj) => (
            <div className="project-item" key={proj.key}>
              <h4 className="project-title-with-icon">{proj.icon} {t(proj.key)}</h4>
              <p>{t(`${proj.key}_desc`)}</p>
              <div className="project-links">
                <a
                  href={proj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  {t("demo")}
                </a>
              </div>
              <div className="project-tags">
                {proj.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="portfolio-divider"></div>

        <h3>{t("myOwnProjects")}</h3>
        <div className="projects-list">
          <div className="project-item">
            <h4 className="project-title-with-icon"><MdiGamepadVariant style={{ fontSize: "2rem", color: "var(--theme-primary)" }} /> {t("dollImpostorQuiz")}</h4>
            <p>{t("project1Description")}</p>
            <div className="project-links">
              <a
                href="https://doll-impostor-quiz.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                {t("demo")}
              </a>
              <a
                href="https://github.com/geliusgelius/doll-impostor-quiz"
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                {t("code")}
              </a>
            </div>
            <div className="project-tags">
              <span>React</span>
              <span>Vite</span>
              <span>SCSS</span>
              <span>TypeScript</span>
            </div>
          </div>

              <div className="project-item">
                <h4 className="project-title-with-icon"><MdiPalette style={{ fontSize: "2rem", color: "var(--theme-primary)" }} /> {t("artistPortfolio")}</h4>
                <p>{t("project2Description")}</p>
                <div className="project-links">
                  <a
                    href="https://geliusgelius.github.io/art-portfolio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    {t("demo")}
                  </a>
                  <a
                    href="https://github.com/geliusgelius/art-portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    {t("code")}
                  </a>
                </div>
                <div className="project-tags">
                  <span>React</span>
                  <span>Vite</span>
                  <span>SCSS</span>
                </div>
              </div>

              <div className="project-item">
                <h4 className="project-title-with-icon"><MdiViewColumn style={{ fontSize: "2rem", color: "var(--theme-primary)" }} /> {t("miniTrello")}</h4>
                <p>{t("project3Description")}</p>
                <div className="project-links">
                  <a
                    href="https://geliusgelius.github.io/trello-mini/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    {t("demo")}
                  </a>
                  <a
                    href="https://github.com/geliusgelius/trello-mini"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    {t("code")}
                  </a>
                </div>
                <div className="project-tags">
                  <span>HTML/CSS</span>
                  <span>JavaScript</span>
                  <span>{t("responsiveDesign")}</span>
                </div>
              </div>
            </div>
      </div>
    );
  };

  const ContactContent = () => {
    const { t } = useLanguage();
    const [showNotification, setShowNotification] = useState(false);

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

        <Notification
          message="Email скопирован в буфер обмена! 📧"
          isVisible={showNotification}
          onClose={handleCloseNotification}
        />
      </div>
    );
  };

  const PhotoEditorContent = () => {
    const { t } = useLanguage();
    const [color, setColor] = useState("#ff1493");
    const [brushSize, setBrushSize] = useState(5);
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasContext, setCanvasContext] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const canvasRef = React.useRef(null);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      setCanvasContext(ctx);

      // Загружаем изображение
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "/avatar.jpg";
      img.onload = () => {
        setOriginalImage(img);
        setImageLoaded(true);
        // Рисуем изображение на холсте с центрированием
        drawImageCentered(ctx, img, canvas);
      };

      img.onerror = () => {
        console.error("Не удалось загрузить изображение");
        setImageLoaded(false);
        // Если изображение не загрузилось, создаем белый фон
        clearToWhite(ctx, canvas);
      };
    }, []);

    // Функция для центрирования изображения на квадратном холсте
    const drawImageCentered = (ctx, img, canvas) => {
      const size = Math.min(canvas.width, canvas.height);
      const x = (canvas.width - size) / 2;
      const y = (canvas.height - size) / 2;

      // Очищаем белым
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рисуем изображение по центру
      ctx.drawImage(img, x, y, size, size);
    };

    // Функция для очистки белым фоном
    const clearToWhite = (ctx, canvas) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Если изображение не загружено, показываем сообщение
      if (!imageLoaded) {
        ctx.fillStyle = "#ff1493";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(t("imageNotFound"), canvas.width / 2, canvas.height / 2);
      }
    };

    const startDrawing = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      setIsDrawing(true);
      if (canvasContext) {
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
      }
    };

    const draw = (e) => {
      if (!isDrawing || !canvasContext) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      canvasContext.lineTo(x, y);
      canvasContext.strokeStyle = color;
      canvasContext.lineWidth = brushSize;
      canvasContext.lineCap = "round";
      canvasContext.lineJoin = "round";
      canvasContext.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      if (canvasContext) {
        canvasContext.closePath();
      }
    };

    // Восстанавливает оригинальную фотографию
    const restoreOriginal = () => {
      if (canvasContext && originalImage) {
        const canvas = canvasRef.current;
        drawImageCentered(canvasContext, originalImage, canvas);
      }
    };

    // Очищает до белого фона
    const clearToWhiteCanvas = () => {
      if (canvasContext) {
        const canvas = canvasRef.current;
        clearToWhite(canvasContext, canvas);
      }
    };

    const saveImage = () => {
      const canvas = canvasRef.current;
      const link = document.createElement("a");
      link.download = "angelina-photo-editor.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    const colors = [
      "#ff1493",
      "#ff69b4",
      "#ffb6c1",
      "#db7093",
      "#000000",
      "#ffffff",
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#00ffff",
      "#ff00ff",
      "#ffa500",
      "#800080",
      "#008000",
      "#ffc0cb",
    ];

    return (
      <div className="window-content">
        <h3>{t("photoEditorTitle")}</h3>
        <div className="paint-tools">
          <div className="tool-section">
            <label>{t("color")}:</label>
            <div className="color-palette">
              {colors.map((col) => (
                <button
                  key={col}
                  className={`color-btn ${color === col ? "active" : ""}`}
                  style={{
                    backgroundColor: col,
                    border:
                      col === "#ffffff" ? "1px solid #ccc" : "2px solid #fff",
                  }}
                  onClick={() => setColor(col)}
                  title={col}
                />
              ))}
            </div>
          </div>

          <div className="tool-section">
            <label>
              {t("brushSize")}: {brushSize}px
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="brush-slider"
            />
          </div>

          <div className="tool-buttons">
            <button onClick={restoreOriginal} className="paint-btn">
              🖼️ {t("restorePhoto")}
            </button>
            <button onClick={clearToWhiteCanvas} className="paint-btn">
              ⬜ {t("clearCanvas")}
            </button>
            <button onClick={saveImage} className="paint-btn">
              💾 {t("save")}
            </button>
          </div>
        </div>

        <div className="paint-canvas-container">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="paint-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={(e) => {
              e.preventDefault();
              startDrawing(e.touches[0]);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              draw(e.touches[0]);
            }}
            onTouchEnd={stopDrawing}
          />
          {!imageLoaded && (
            <div className="image-loading">{t("loadingImage")}</div>
          )}
        </div>

        <div className="paint-hint">
          💡 <strong>{t("restorePhoto")}</strong> - {t("restorePhotoHint")}
          <br />
          💡 <strong>{t("clearCanvas")}</strong> - {t("clearCanvasHint")}
          <br />
          {!imageLoaded && t("imageNotFound")}
        </div>
      </div>
    );
  };

  // ОБНОВЛЕННЫЙ GamesContent С ИСПОЛЬЗОВАНИЕМ СОСТОЯНИЯ ИЗ DESKTOP
  const GamesContent = () => {
    return (
      <div className="window-content">
        <GamesFolder />
      </div>
    );
  };

  if (isRestarting) {
    return (
      <div className="restart-screen">
        <div className="restart-text">{t("restart")}</div>
      </div>
    );
  }

  if (showPreloader) {
    return <Preloader />;
  }

  return (
    <div className="desktop" onClick={() => setShowStartMenu(false)}>
      <div className="crt-effect">
        <div className="scanlines"></div>
        <div className="desktop-background">
          <div className="pixel-grid"></div>
          <div className="desktop-icons">
            <DesktopIcon
              iconId="aboutMe"
              icon={<MaterialSymbolsAccountCircle />}
              title={t("aboutMe")}
              onClick={() =>
                openWindow(
                  t("aboutMeTitle"),
                  <MaterialSymbolsAccountCircle style={{ fontSize: "1rem" }} />,
                  AboutMeContent,
                  "aboutMe"
                )
              }
              isLocked={iconsLocked}
              onPositionChange={(position) =>
                handleIconPositionChange("aboutMe", position)
              }
              initialPosition={
                iconPositions.aboutMe || defaultIconPositions.aboutMe
              }
            />

            <DesktopIcon
              iconId="skills"
              icon={<MdiLightningBolt />}
              title={t("skills")}
              onClick={() =>
                openWindow(
                  t("skillsTitle"),
                  <MdiLightningBolt style={{ fontSize: "1rem" }} />,
                  SkillsContent,
                  "skills"
                )
              }
              isLocked={iconsLocked}
              onPositionChange={(position) =>
                handleIconPositionChange("skills", position)
              }
              initialPosition={
                iconPositions.skills || defaultIconPositions.skills
              }
            />

            <DesktopIcon
              iconId="portfolio"
              icon={<BytesizePortfolio />}
              title={t("portfolio")}
              onClick={() =>
                openWindow(
                  t("portfolioTitle"),
                  <BytesizePortfolio style={{ fontSize: "1rem" }} />,
                  PortfolioContent,
                  "portfolio"
                )
              }
              isLocked={iconsLocked}
              onPositionChange={(position) =>
                handleIconPositionChange("portfolio", position)
              }
              initialPosition={
                iconPositions.portfolio || defaultIconPositions.portfolio
              }
            />

            <DesktopIcon
              iconId="photoEditor"
              icon={<StreamlinePixelDesignColorPaintingPalette />}
              title={t("photoEditor")}
              onClick={() =>
                openWindow(
                  t("photoEditorTitle"),
                  <StreamlinePixelDesignColorPaintingPalette
                    style={{ fontSize: "1rem" }}
                  />,
                  PhotoEditorContent,
                  "photoEditor"
                )
              }
              isLocked={iconsLocked}
              onPositionChange={(position) =>
                handleIconPositionChange("photoEditor", position)
              }
              initialPosition={
                iconPositions.photoEditor || defaultIconPositions.photoEditor
              }
            />

            <DesktopIcon
              iconId="contact"
              icon={<MaterialSymbolsContactMailOutline />}
              title={t("contact")}
              onClick={() =>
                openWindow(
                  t("contactTitle"),
                  <MaterialSymbolsContactMailOutline
                    style={{ fontSize: "1rem" }}
                  />,
                  ContactContent,
                  "contact"
                )
              }
              isLocked={iconsLocked}
              onPositionChange={(position) =>
                handleIconPositionChange("contact", position)
              }
              initialPosition={
                iconPositions.contact || defaultIconPositions.contact
              }
            />

            <DesktopIcon
              iconId="games"
              icon={
                <MaterialSymbolsFolderCopyOutline></MaterialSymbolsFolderCopyOutline>
              }
              title={t("games")}
              onClick={() =>
                openWindow(
                  t("gamesTitle"),
                  <MaterialSymbolsFolderCopyOutline></MaterialSymbolsFolderCopyOutline>,
                  GamesContent,
                  "games"
                )
              }
              isLocked={iconsLocked}
              onPositionChange={(position) =>
                handleIconPositionChange("games", position)
              }
              initialPosition={
                iconPositions.games || defaultIconPositions.games
              }
            />
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
        iconsLocked={iconsLocked}
        onToggleIconsLock={toggleIconsLock}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        onBackgroundChange={() => setShowBackgroundSelector(true)}
      />

      {showStartMenu && (
        <StartMenu
          onOpenWindow={openWindow}
          onClose={() => setShowStartMenu(false)}
          onShutdown={handleShutdown}
          aboutMeContent={AboutMeContent}
          skillsContent={SkillsContent}
          portfolioContent={PortfolioContent}
          contactContent={ContactContent}
          photoEditorContent={PhotoEditorContent}
          gamesContent={GamesContent}
        />
      )}

      {showEasterEgg && <EasterEgg />}

      {showShutdown && <ShutdownScreen onRestart={handleRestart} />}

      {showBSOD && (
        <BSOD
          onClose={() => setShowBSOD(false)}
          onRestart={handleBSODRestart}
        />
      )}

      {showBackgroundSelector && (
        <BackgroundSelector
          onClose={() => setShowBackgroundSelector(false)}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
        />
      )}

      <Notification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ message: "", isVisible: false })}
      />
    </div>
  );
};

export default Desktop;
