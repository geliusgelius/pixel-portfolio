import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Window.css";

const Window = ({
  windowData,
  isActive,
  onClose,
  onMinimize,
  onBringToFront,
  onPositionChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  if (windowData.isMinimized) return null;

  const handleMouseDown = (e) => {
    if (!isActive) onBringToFront();

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowData.position.x,
      y: e.clientY - windowData.position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    onPositionChange({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <motion.div
      className={`window ${isActive ? "active" : ""}`}
      style={{
        left: windowData.position.x,
        top: windowData.position.y,
        width: windowData.size.width,
        height: windowData.size.height,
        zIndex: isActive ? 1000 : 100,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={onBringToFront}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <div className="window-title">
          <span className="window-icon">{windowData.icon}</span>
          {windowData.title}
        </div>
        <div className="window-controls">
          <button className="control-btn minimize" onClick={onMinimize}>
            −
          </button>
          <button className="control-btn close" onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      <div className="window-body">{windowData.content}</div>
    </motion.div>
  );
};

export default Window;
