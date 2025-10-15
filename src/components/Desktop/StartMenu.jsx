import React, { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./StartMenu.css";
import {
  MaterialSymbolsAccountCircle,
  MdiLightningBolt,
  BytesizePortfolio,
  MaterialSymbolsContactMailOutline,
  StreamlinePixelDesignColorPaintingPalette,
  FluentTetrisApp20Regular,
} from "./icones";

const StartMenu = ({
  onOpenWindow,
  onClose,
  onShutdown,
  aboutMeContent,
  skillsContent,
  portfolioContent,
  contactContent,
  photoEditorContent,
  gamesContent,
}) => {
  const { t, currentLanguage, switchLanguage } = useLanguage();

  // Принудительно обновляем стили при монтировании
  useEffect(() => {
    // Даем браузеру время применить CSS переменные
    const timer = setTimeout(() => {
      // Форсируем перерисовку через изменение стилей
      const startMenu = document.querySelector(".start-menu");
      if (startMenu) {
        startMenu.style.display = "none";
        setTimeout(() => {
          startMenu.style.display = "block";
        }, 10);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = (lang) => {
    switchLanguage(lang);
    onClose();
  };

  const handleShutdown = () => {
    onClose();
    onShutdown();
  };

  // Используем переданные компоненты
  const menuItems = [
    {
      icon: <MaterialSymbolsAccountCircle style={{ fontSize: "1.5rem" }} />,
      title: t("aboutMeTitle"),
      action: () =>
        onOpenWindow(
          t("aboutMeTitle"),
          <MaterialSymbolsAccountCircle style={{ fontSize: "1rem" }} />,
          aboutMeContent,
          "aboutMe"
        ),
    },
    {
      icon: <MdiLightningBolt style={{ fontSize: "1.5rem" }} />,
      title: t("skillsTitle"),
      action: () =>
        onOpenWindow(
          t("skillsTitle"),
          <MdiLightningBolt style={{ fontSize: "1rem" }} />,
          skillsContent,
          "skills"
        ),
    },
    {
      icon: <BytesizePortfolio style={{ fontSize: "1.5rem" }} />,
      title: t("portfolioTitle"),
      action: () =>
        onOpenWindow(
          t("portfolioTitle"),
          <BytesizePortfolio style={{ fontSize: "1rem" }} />,
          portfolioContent,
          "portfolio"
        ),
    },
    {
      icon: (
        <MaterialSymbolsContactMailOutline style={{ fontSize: "1.5rem" }} />
      ),
      title: t("contactTitle"),
      action: () =>
        onOpenWindow(
          t("contactTitle"),
          <MaterialSymbolsContactMailOutline style={{ fontSize: "1rem" }} />,
          contactContent,
          "contact"
        ),
    },
    {
      icon: (
        <StreamlinePixelDesignColorPaintingPalette
          style={{ fontSize: "1.5rem" }}
        />
      ),
      title: t("photoEditorTitle"),
      action: () =>
        onOpenWindow(
          t("photoEditorTitle"),
          <StreamlinePixelDesignColorPaintingPalette
            style={{ fontSize: "1rem" }}
          />,
          photoEditorContent,
          "photoEditor"
        ),
    },
    {
      icon: <FluentTetrisApp20Regular style={{ fontSize: "1.5rem" }} />,
      title: t("gamesTitle"),
      action: () =>
        onOpenWindow(
          t("gamesTitle"),
          <FluentTetrisApp20Regular style={{ fontSize: "1rem" }} />,
          gamesContent,
          "games"
        ),
    },
  ];

  return (
    <div className="start-menu" onClick={(e) => e.stopPropagation()}>
      <div className="start-menu-header">
        <span className="start-menu-title">Angelina OS</span>
        <span className="start-menu-version">v2.0</span>
      </div>

      <div className="start-menu-items">
        {menuItems.map((item, index) => (
          <div key={index} className="start-menu-item" onClick={item.action}>
            <span className="start-menu-icon">{item.icon}</span>
            <span className="start-menu-text">{item.title}</span>
          </div>
        ))}
      </div>

      <div className="start-menu-footer">
        <div className="language-selector">
          <span>Язык / Language:</span>
          <div className="language-buttons">
            <button
              className={`lang-btn ${currentLanguage === "ru" ? "active" : ""}`}
              onClick={() => handleLanguageChange("ru")}
            >
              Русский
            </button>
            <button
              className={`lang-btn ${currentLanguage === "en" ? "active" : ""}`}
              onClick={() => handleLanguageChange("en")}
            >
              English
            </button>
          </div>
        </div>

        <div className="start-menu-shutdown">
          <button className="shutdown-btn" onClick={handleShutdown}>
            {t("shutdown")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
