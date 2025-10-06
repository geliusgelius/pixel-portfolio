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
  onSizeChange,
  currentLanguage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const contentKey = `${windowData.id}-${currentLanguage}`;

  // Обработка перемещения окна
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

  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e) => {
        if (!isResizing) return;

        const newWidth = Math.max(
          300,
          resizeStart.width + (e.clientX - resizeStart.x)
        );
        const newHeight = Math.max(
          200,
          resizeStart.height + (e.clientY - resizeStart.y)
        );

        onSizeChange({
          width: newWidth,
          height: newHeight,
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, resizeStart, onSizeChange]);

  const handleMouseDown = (e) => {
    if (!isActive) onBringToFront();

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowData.position.x,
      y: e.clientY - windowData.position.y,
    });
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    if (!isActive) onBringToFront();

    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: windowData.size.width,
      height: windowData.size.height,
    });
  };

  if (windowData.isMinimized) {
    return null;
  }

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
        <WindowContent key={contentKey} />
      </div>

      {}
      <div
        className="window-resize-handle"
        onMouseDown={handleResizeStart}
        title="Изменить размер"
      >
        <div className="resize-corner">
          <div className="resize-line horizontal"></div>
          <div className="resize-line vertical"></div>
        </div>
      </div>

      {}
      <div className="resize-border top" onMouseDown={handleResizeStart} />
      <div className="resize-border right" onMouseDown={handleResizeStart} />
      <div className="resize-border bottom" onMouseDown={handleResizeStart} />
      <div className="resize-border left" onMouseDown={handleResizeStart} />
    </motion.div>
  );
};

export default Window;
