import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  MaterialSymbolsAccountCircle,
  MdiLightningBolt,
  BytesizePortfolio,
  MaterialSymbolsContactMailOutline,
  StreamlinePixelDesignColorPaintingPalette,
  FluentTetrisApp20Regular,
  MdiShutdown,
} from "./icones";
import "./StartMenu.css";

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
  const { t } = useLanguage();

  const menuItems = [
    {
      id: "aboutMe",
      title: t("aboutMe"),
      description: t("aboutMeTitle"),
      icon: <MaterialSymbolsAccountCircle />,
      content: aboutMeContent,
    },
    {
      id: "skills",
      title: t("skills"),
      description: t("skillsTitle"),
      icon: <MdiLightningBolt />,
      content: skillsContent,
    },
    {
      id: "portfolio",
      title: t("portfolio"),
      description: t("portfolioTitle"),
      icon: <BytesizePortfolio />,
      content: portfolioContent,
    },
    {
      id: "photoEditor",
      title: t("photoEditor"),
      description: t("photoEditorTitle"),
      icon: <StreamlinePixelDesignColorPaintingPalette />,
      content: photoEditorContent,
    },
    {
      id: "contact",
      title: t("contact"),
      description: t("contactTitle"),
      icon: <MaterialSymbolsContactMailOutline />,
      content: contactContent,
    },
    {
      id: "games",
      title: t("games"),
      description: t("gamesTitle"),
      icon: <FluentTetrisApp20Regular />,
      content: gamesContent,
    },
  ];

  const handleMenuItemClick = (item) => {
    onOpenWindow(item.description, item.icon, item.content, item.id);
    onClose();
  };

  return (
    <div className="start-menu" onClick={(e) => e.stopPropagation()}>
      <div className="start-menu-header">
        <div className="user-info">
          <div className="user-avatar">👩‍💻</div>
          <div className="user-details">
            <div className="user-name">{t("name")}</div>
            <div className="user-profession">{t("profession")}</div>
          </div>
        </div>
      </div>

      <div className="start-menu-content">
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="menu-item"
              onClick={() => handleMenuItemClick(item)}
            >
              <div className="menu-item-icon">{item.icon}</div>
              <div className="menu-item-info">
                <div className="menu-item-title">{item.title}</div>
                <div className="menu-item-description">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="start-menu-footer">
        <div className="power-options">
          <button className="power-button" onClick={onShutdown}>
            <MdiShutdown className="power-icon" />
            <span>{t("shutdown")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
