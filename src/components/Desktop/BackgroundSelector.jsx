import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { themes } from "../../utils/themes";
import "./BackgroundSelector.css";

const BackgroundSelector = ({ onClose, currentTheme, onThemeChange }) => {
  const { t } = useLanguage();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const themeList = Object.values(themes);

  const handleApply = () => {
    console.log("Applying theme:", selectedTheme);
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
          {themeList.map((theme) => (
            <div
              key={theme.id}
              className={`theme-option ${
                selectedTheme === theme.id ? "selected" : ""
              }`}
              onClick={() => {
                console.log("Selected theme:", theme.id, theme.name);
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
