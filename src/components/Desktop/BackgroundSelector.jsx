import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { themes } from "../../utils/themes";
import "./BackgroundSelector.css";

const BackgroundSelector = ({ onClose, currentTheme, onThemeChange }) => {
  const { t } = useLanguage();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const themeList = Object.values(themes);

  // Функция для получения переведенного названия темы
  const getTranslatedThemeName = (themeId) => {
    const translationMap = {
      pink: "bgPink",
      cottonCandy: "bgCottonCandy",
      ocean: "bgOcean",
      forest: "bgForest",
      sunset: "bgSunset",
      galaxy: "bgGalaxy",
    };

    const translationKey = translationMap[themeId];

    if (translationKey) {
      const translated = t(translationKey);
      // Если перевод найден, используем его
      return translated;
    }

    // Запасной вариант - возвращаем оригинальное имя из темы
    const theme = themes[themeId];
    return theme?.name || themeId;
  };

  const handleApply = () => {
    console.log("Applying theme:", selectedTheme);
    onThemeChange(selectedTheme);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("selectDesktopBackground")}</h2>
          <button className="modal-close" onClick={handleCancel}>
            ×
          </button>
        </div>

        <div className="themes-grid">
          {themeList.map((theme) => (
            <div
              key={theme.id}
              className={`theme-option ${
                selectedTheme === theme.id ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedTheme(theme.id);
              }}
            >
              <div
                className="theme-preview"
                style={{ background: theme.colors.background }}
              >
                <div className="theme-preview-content">
                  <div className="preview-icon">🖥️</div>
                  <div className="preview-icon">📁</div>
                  <div className="preview-icon">📄</div>
                </div>
              </div>
              <div className="theme-name">
                {getTranslatedThemeName(theme.id)}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="modal-button cancel" onClick={handleCancel}>
            {t("cancel")}
          </button>
          <button className="modal-button apply" onClick={handleApply}>
            {t("apply")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
