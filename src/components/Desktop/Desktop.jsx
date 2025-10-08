import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import Taskbar from "./Taskbar";
import Window from "./Window";
import StartMenu from "./StartMenu";
import EasterEgg from "./EasterEgg";
import ShutdownScreen from "./ShutdownScreen";
import Notification from "./Notification";
import DesktopIcon from "./DesktopIcon";
import BSOD from "./BSOD";
import Preloader from "../Preloader/Preloader";
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
} from "./icones";

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

  // Начальные позиции для значков
  const defaultIconPositions = {
    aboutMe: { x: 20, y: 20 },
    skills: { x: 20, y: 120 },
    portfolio: { x: 20, y: 220 },
    photoEditor: { x: 20, y: 320 },
    contact: { x: 20, y: 420 },
  };

  // Автоматически открываем окно "Обо мне" при загрузке
  useEffect(() => {
    const timer = setTimeout(() => {
      openWindow(
        t("aboutMeTitle"),
        <MaterialSymbolsAccountCircle style={{ fontSize: "1rem" }} />,
        AboutMeContent
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
    setShowBSOD(true);
  };

  const handleBSODRestart = () => {
    // Закрываем BSOD и запускаем перезагрузку
    setShowBSOD(false);
    setShowPreloader(true);

    // Через 3 секунды показываем прелоадер и перезагружаем систему
    setTimeout(() => {
      setShowPreloader(false);
      // Полностью сбрасываем состояние
      setWindows([]);
      setActiveWindow(null);
      setIconPositions({});

      // Снова открываем окно "Обо мне" как при первой загрузке
      setTimeout(() => {
        openWindow(
          t("aboutMeTitle"),
          <MaterialSymbolsAccountCircle style={{ fontSize: "1rem" }} />,
          AboutMeContent
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

      // При перезагрузке снова открываем окно "Обо мне"
      setTimeout(() => {
        openWindow(
          t("aboutMeTitle"),
          <MaterialSymbolsAccountCircle style={{ fontSize: "1rem" }} />,
          AboutMeContent
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
    setIconsLocked(!iconsLocked);
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
        }

        return { ...window, title: newTitle };
      })
    );
  };

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
                  AboutMeContent
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
                  SkillsContent
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
                  PortfolioContent
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
                  PhotoEditorContent
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
                  ContactContent
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
          <h4>{t("dollImpostorQuiz")}</h4>
          <p>Веб-приложение квиз по игре Doll Impostor</p>
          <div className="project-links">
            <a
              href="https://doll-impostor-quiz.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Демо
            </a>
            <a
              href="https://github.com/geliusgelius/doll-impostor-quiz"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Код
            </a>
          </div>
          <div className="project-tags">
            <span>React</span>
            <span>Vite</span>
            <span>SCSS</span>
            <span>TypeScript</span>
          </div>
        </div>

        <div className="project-item pixel-border">
          <h4>{t("artistPortfolio")}</h4>
          <p>
            Лендинг-портфолио для художника с адаптивным дизайном и галереей
            работ
          </p>
          <div className="project-links">
            <a
              href="https://geliusgelius.github.io/art-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Демо
            </a>
            <a
              href="https://github.com/geliusgelius/art-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Код
            </a>
          </div>
          <div className="project-tags">
            <span>React</span>
            <span>Vite</span>
            <span>SCSS</span>
          </div>
        </div>

        <div className="project-item pixel-border">
          <h4>{t("miniTrello")}</h4>
          <p>Минималистичный, но функциональный аналог Trello</p>
          <div className="project-links">
            <a
              href="https://geliusgelius.github.io/trello-mini/"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Демо
            </a>
            <a
              href="https://github.com/geliusgelius/trello-mini"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Код
            </a>
          </div>
          <div className="project-tags">
            <span>HTML/CSS</span>
            <span>JavaScript</span>
            <span>Адаптивная верстка</span>
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
    img.src = "/src/assets/images/avatar.jpg";
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
      ctx.fillText(
        "Фотография не найдена",
        canvas.width / 2,
        canvas.height / 2
      );
      ctx.fillText(canvas.width / 2, canvas.height / 2 + 25);
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
      <h3>Фоторедактор / Photo Editor</h3>
      <div className="paint-tools">
        <div className="tool-section">
          <label>Цвет:</label>
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
          <label>Размер кисти: {brushSize}px</label>
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
            🖼️ Восстановить фото
          </button>
          <button onClick={clearToWhiteCanvas} className="paint-btn">
            ⬜ Очистить холст
          </button>
          <button onClick={saveImage} className="paint-btn">
            💾 Сохранить
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
          <div className="image-loading">Загрузка изображения...</div>
        )}
      </div>

      <div className="paint-hint">
        💡 <strong>Восстановить фото</strong> - вернет оригинальную фотографию
        <br />
        💡 <strong>Очистить холст</strong> - полностью очистит холст белым
        цветом
        <br />
        {!imageLoaded && ""}
      </div>
    </div>
  );
};

export default Desktop;
