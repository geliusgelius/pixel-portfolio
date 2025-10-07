import React, { useState } from "react";
import { motion } from "framer-motion";

const DesktopIcon = ({
  iconId,
  icon,
  title,
  onClick,
  isLocked,
  onPositionChange,
  initialPosition = { x: 0, y: 0 },
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);

    const newPosition = {
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    };

    setPosition(newPosition);

    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  };

  const handleClick = (e) => {
    // Открываем окно только если не было драга
    if (!isDragging) {
      onClick(e);
    }
  };

  return (
    <motion.div
      className="desktop-icon"
      onClick={handleClick}
      drag={!isLocked}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // УБИРАЕМ ВСЕ АНИМАЦИИ ХОВЕРА И ТАПА
      style={{
        cursor: isLocked ? "default" : "grab",
        x: position.x,
        y: position.y,
      }}
      // УБИРАЕМ ОГРАНИЧЕНИЯ ПЕРЕТАСКИВАНИЯ
      dragConstraints={false}
    >
      <div className="icon">{icon}</div>
      <span>{title}</span>
      {isLocked && (
        <div className="lock-overlay">
          <span className="lock-indicator">🔒</span>
        </div>
      )}
    </motion.div>
  );
};

export default DesktopIcon;
