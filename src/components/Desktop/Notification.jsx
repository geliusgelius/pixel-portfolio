import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Notification.css";

const Notification = ({ message, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="notification"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="notification-content pixel-border">
            <div className="notification-icon">✓</div>
            <div className="notification-text">{message}</div>
            <button className="notification-close" onClick={onClose}>
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
