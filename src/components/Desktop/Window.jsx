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
  currentLanguage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Добавляем ключ для принудительного перерисовывания контента при смене языка
  const contentKey = `${windowData.id}-${currentLanguage}`;

  useEffect(() => {
    if (isDragging) {
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

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, onPositionChange]);

  const handleMouseDown = (e) => {
    if (!isActive) onBringToFront();

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowData.position.x,
      y: e.clientY - windowData.position.y,
    });
  };

  if (windowData.isMinimized) {
    return null;
  }

  // Создаем компонент контента динамически
  const WindowContent = windowData.ContentComponent;

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

      <div className="window-body">
        <WindowContent key={contentKey} />{" "}
        {/* Ключ заставляет перерисовываться при смене языка */}
      </div>
    </motion.div>
  );
};

export default Window;
