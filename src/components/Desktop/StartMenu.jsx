import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { languageNames } from "../../utils/translations";
import "./StartMenu.css";

const StartMenu = ({ onOpenWindow, onClose, onShutdown }) => {
  const { t, currentLanguage, switchLanguage } = useLanguage();

  const handleLanguageChange = (lang) => {
    switchLanguage(lang);
    onClose();
  };

  const handleShutdown = () => {
    onClose();
    onShutdown();
  };

  // Передаем компоненты вместо готового JSX
  const menuItems = [
    {
      icon: "👤",
      title: t("aboutMeTitle"),
      action: () => onOpenWindow(t("aboutMeTitle"), "👤", AboutMeContent),
    },
    {
      icon: "⚡",
      title: t("skillsTitle"),
      action: () => onOpenWindow(t("skillsTitle"), "⚡", SkillsContent),
    },
    {
      icon: "💼",
      title: t("portfolioTitle"),
      action: () => onOpenWindow(t("portfolioTitle"), "💼", PortfolioContent),
    },
    {
      icon: "📧",
      title: t("contactTitle"),
      action: () => onOpenWindow(t("contactTitle"), "📧", ContactContent),
    },
    {
      icon: "🎨",
      title: t("paintTitle"),
      action: () => onOpenWindow(t("paintTitle"), "🎨", PaintContent),
    },
  ];

  const AboutMeContent = () => {
    const { t } = useLanguage();
    return <div>About Me Content</div>;
  };

  const SkillsContent = () => {
    const { t } = useLanguage();
    return <div>Skills Content</div>;
  };

  const PortfolioContent = () => {
    const { t } = useLanguage();
    return <div>Portfolio Content</div>;
  };

  const ContactContent = () => {
    const { t } = useLanguage();
    return <div>Contact Content</div>;
  };

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
