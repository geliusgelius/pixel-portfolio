import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import "./BSOD.css";

const BSOD = ({ onClose, onRestart }) => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { percentage: 0, message: t("bsodStep1") },
    { percentage: 15, message: t("bsodStep2") },
    { percentage: 35, message: t("bsodStep3") },
    { percentage: 60, message: t("bsodStep4") },
    { percentage: 85, message: t("bsodStep5") },
    { percentage: 100, message: t("bsodStep6") },
  ];

  useEffect(() => {
    // Запускаем анимацию прогресса
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Запускаем перезагрузку через 1 секунду после завершения
          setTimeout(() => {
            onRestart();
          }, 1000);
          return 100;
        }
        return prev + 0.5; // Медленное увеличение для драматизма
      });
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, [onRestart]);

  useEffect(() => {
    // Обновляем текущий шаг на основе прогресса
    const currentStepIndex = steps.findIndex(
      (step) => progress < step.percentage
    );
    setCurrentStep(currentStepIndex >= 0 ? currentStepIndex : steps.length - 1);
  }, [progress, steps]);

  const currentStepData = steps[currentStep] || steps[steps.length - 1];

  return (
    <motion.div
      className="bsod-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bsod-content">
        <div className="bsod-header">
          <div className="bsod-face">:(</div>
          <div className="bsod-title">
            <p>{t("bsodTitle")}</p>
          </div>
        </div>

        <div className="bsod-message">
          <p>{t("bsodErrorCode")}</p>
          <br />
          <p>{t("bsodMessage1")}</p>
          <p>{t("bsodMessage2")}</p>
          <br />

          <div className="bsod-progress-section">
            <div className="bsod-step-message">{currentStepData.message}</div>
            <div className="bsod-percentage">
              {Math.round(progress)}% {t("bsodComplete")}
            </div>
            <div className="bsod-progress-container">
              <div
                className="bsod-progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bsod-qr">
            <div className="qr-code">
              <div className="qr-pixels">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="qr-pixel" />
                ))}
              </div>
            </div>
            <div className="qr-text">
              <p>{t("bsodMoreInfo")}</p>
              <p>{t("bsodWebsite")}</p>
              <br />
              <p>{t("bsodSupport")}</p>
              <p>{t("bsodStopCode")}</p>
            </div>
          </div>
        </div>

        <div className="bsod-footer">
          <div className="bsod-collecting">
            <div className="collecting-dots">
              <span>{t("bsodCollecting")}</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BSOD;
