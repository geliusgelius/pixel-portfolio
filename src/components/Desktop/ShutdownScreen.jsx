import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import "./ShutdownScreen.css";

const ShutdownScreen = ({ onRestart }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { text: t("shutdownSaving"), duration: 2000 },
    { text: t("shutdownClosing"), duration: 1500 },
    { text: t("shutdownWindows"), duration: 1000 },
    { text: t("shutdownOff"), duration: 500 },
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 100 / (step.duration / 50);
        });
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(0);
        setCurrentStep((prev) => prev + 1);
      }, step.duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(timeout);
      };
    } else {
      // Цикл завершен, перезапускаем
      const restartTimeout = setTimeout(() => {
        onRestart();
      }, 3000);

      return () => clearTimeout(restartTimeout);
    }
  }, [currentStep, steps, onRestart]);

  // Фон для каждого шага
  const backgrounds = [
    "linear-gradient(45deg, #ff69b4, #ff1493)",
    "linear-gradient(45deg, #db7093, #c71585)",
    "linear-gradient(45deg, #ff1493, #dc143c)",
    "linear-gradient(45deg, #000000, #2d002d)",
  ];

  return (
    <motion.div
      className="shutdown-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background: backgrounds[Math.min(currentStep, backgrounds.length - 1)],
      }}
    >
      <div className="crt-effect">
        <div className="scanlines"></div>
        <div className="flicker"></div>
      </div>

      <div className="shutdown-content">
        <AnimatePresence mode="wait">
          {currentStep < steps.length ? (
            <motion.div
              key={currentStep}
              className="shutdown-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {}
              <div className="angelina-logo">
                <div className="logo-icon">👩‍💻</div>
                <div className="logo-text">Angelina OS</div>
              </div>

              <div className="shutdown-text">{steps[currentStep].text}</div>

              <div className="shutdown-progress">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="shutdown-hint">{t("shutdownHint")}</div>
            </motion.div>
          ) : (
            <motion.div
              key="poweroff"
              className="poweroff-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="monitor-off">
                <div className="power-light">●</div>
                <div className="power-text">{t("shutdownSafe")}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {}
      <div className="blinking-cursor">_</div>
    </motion.div>
  );
};

export default ShutdownScreen;
