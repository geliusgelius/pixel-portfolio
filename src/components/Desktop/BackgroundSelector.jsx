import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./BackgroundSelector.css";

const BackgroundSelector = ({ onClose, currentTheme, onThemeChange }) => {
  const { t } = useLanguage();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const themes = [
    { id: "pink", name: t("bgPinkGradient") },
    { id: "blue", name: t("bgBlueGradient") },
    { id: "green", name: t("bgGreenGradient") },
    { id: "purple", name: t("bgPurpleGradient") },
    { id: "sunset", name: t("bgSunset") },
    { id: "ocean", name: t("bgOcean") },
    { id: "forest", name: t("bgForest") },
    { id: "cotton-candy", name: t("bgCottonCandy") },
  ];

  const handleApply = () => {
    onThemeChange(selectedTheme);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("selectDesktopBackground")}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="themes-grid">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`theme-option ${
                selectedTheme === theme.id ? "selected" : ""
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <div className={`theme-preview theme-${theme.id}`}>
                <div className="theme-preview-content">
                  <div className="preview-icon">🖥️</div>
                  <div className="preview-icon">📁</div>
                  <div className="preview-icon">📄</div>
                </div>
              </div>
              <div className="theme-name">{theme.name}</div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="modal-button cancel" onClick={onClose}>
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
