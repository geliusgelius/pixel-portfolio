import React from "react";
import { motion } from "framer-motion";
import "./EasterEgg.css";

const EasterEgg = () => {
  return (
    <motion.div
      className="easter-egg"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="easter-egg-content">
        <div className="easter-egg-title">🎉 Пасхалка найдена! 🎉</div>
        <div className="easter-egg-message">
          <p>Ты нашел секретную функцию!</p>
          <p>Ангелина - лучший фронтенд разработчик! 💖</p>
          <div className="pixel-cat">(=^･ω･^=)</div>
        </div>
        <div className="easter-egg-animation">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-heart"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: -100, opacity: 1 }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              💖
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default EasterEgg;
