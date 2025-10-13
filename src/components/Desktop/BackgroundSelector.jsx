import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./BackgroundSelector.css";

const BackgroundSelector = ({
  currentBackground,
  onBackgroundChange,
  onClose,
}) => {
  const { t } = useLanguage();
  const [selectedBg, setSelectedBg] = useState(currentBackground);

  const backgrounds = [
    {
      id: "default",
      name: t("bgPinkGradient"),
      preview: "linear-gradient(45deg, #ffb6c1, #ff69b4, #db7093)",
      value: "linear-gradient(45deg, #ffb6c1, #ff69b4, #db7093)",
    },
    {
      id: "blue",
      name: t("bgBlueGradient"),
      preview: "linear-gradient(45deg, #87ceeb, #4682b4, #1e90ff)",
      value: "linear-gradient(45deg, #87ceeb, #4682b4, #1e90ff)",
    },
    {
      id: "green",
      name: t("bgGreenGradient"),
      preview: "linear-gradient(45deg, #98fb98, #32cd32, #228b22)",
      value: "linear-gradient(45deg, #98fb98, #32cd32, #228b22)",
    },
    {
      id: "purple",
      name: t("bgPurpleGradient"),
      preview: "linear-gradient(45deg, #d8bfd8, #9370db, #8a2be2)",
      value: "linear-gradient(45deg, #d8bfd8, #9370db, #8a2be2)",
    },
    {
      id: "sunset",
      name: t("bgSunset"),
      preview: "linear-gradient(45deg, #ff7e5f, #feb47b, #ff6a95)",
      value: "linear-gradient(45deg, #ff7e5f, #feb47b, #ff6a95)",
    },
    {
      id: "ocean",
      name: t("bgOcean"),
      preview: "linear-gradient(45deg, #00b4db, #0083b0, #0056b3)",
      value: "linear-gradient(45deg, #00b4db, #0083b0, #0056b3)",
    },
    {
      id: "forest",
      name: t("bgForest"),
      preview: "linear-gradient(45deg, #667eea, #764ba2, #2c5530)",
      value: "linear-gradient(45deg, #667eea, #764ba2, #2c5530)",
    },
    {
      id: "cottonCandy",
      name: t("bgCottonCandy"),
      preview: "linear-gradient(45deg, #ff9a9e, #fad0c4, #fad0c4)",
      value: "linear-gradient(45deg, #ff9a9e, #fad0c4, #fad0c4)",
    },
  ];

  const handleApply = () => {
    console.log("Applying background:", selectedBg);
    if (onBackgroundChange && typeof onBackgroundChange === "function") {
      onBackgroundChange(selectedBg);
    } else {
      console.error(
        "onBackgroundChange is not a function:",
        onBackgroundChange
      );
    }
    onClose();
  };

  const handleBackgroundSelect = (bgValue) => {
    console.log("Selected background:", bgValue);
    setSelectedBg(bgValue);
  };

  return (
    <div className="background-selector-overlay" onClick={onClose}>
      <div
        className="background-selector-window"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="background-selector-header">
          <h3>{t("selectDesktopBackground")}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="background-selector-content">
          <div className="background-grid">
            {backgrounds.map((bg) => (
              <div
                key={bg.id}
                className={`background-item ${
                  selectedBg === bg.value ? "selected" : ""
                }`}
                onClick={() => handleBackgroundSelect(bg.value)}
              >
                <div
                  className="background-preview"
                  style={{ background: bg.preview }}
                />
                <span className="background-name">{bg.name}</span>
              </div>
            ))}
          </div>

          <div className="background-preview-large">
            <div className="preview-title">{t("preview")}:</div>
            <div className="preview-desktop" style={{ background: selectedBg }}>
              <div className="preview-icons">
                <div className="preview-icon"></div>
                <div className="preview-icon"></div>
                <div className="preview-icon"></div>
              </div>
            </div>
            <div className="current-background-info">
              {t("currentBackground")}:{" "}
              {backgrounds.find((bg) => bg.value === selectedBg)?.name}
            </div>
          </div>
        </div>

        <div className="background-selector-footer">
          <button className="apply-btn" onClick={handleApply}>
            {t("apply")}
          </button>
          <button className="cancel-btn" onClick={onClose}>
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
