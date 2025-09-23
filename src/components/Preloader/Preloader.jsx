import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./Preloader.css";

const Preloader = () => {
  const { t } = useLanguage();

  return (
    <div className="preloader">
      <div className="crt-effect">
        <div className="scanlines"></div>

        <div className="pixel-monitor">
          <div className="monitor-frame">
            <div className="monitor-screen">
              <div className="boot-animation">
                <div className="pixel-logo">★</div>
                <h1 className="pixel-name">Angelina Smirnova</h1>
                <div className="loading-pixels">
                  <div className="pixel-row">
                    <div className="pixel"></div>
                    <div className="pixel"></div>
                    <div className="pixel"></div>
                    <div className="pixel"></div>
                    <div className="pixel"></div>
                  </div>
                </div>
                <div className="boot-text">
                  <p>{t("initializing")}</p>
                  <p>{t("loadingGraphics")}</p>
                  <p>{t("ready")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="monitor-stand">
            <div className="stand-base"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
