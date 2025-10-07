import React, { useState, useRef, useEffect } from "react";

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
  const iconRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const wasDragged = useRef(false);

  const handleMouseDown = (e) => {
    if (isLocked) {
      // Для заблокированных - просто запоминаем что кликнули
      wasDragged.current = false;
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    wasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    dragStartOffset.current = { x: position.x, y: position.y };

    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (isLocked) return;

    if (!isDragging) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      wasDragged.current = true;
    }

    const newPosition = {
      x: dragStartOffset.current.x + deltaX,
      y: dragStartOffset.current.y + deltaY,
    };

    setPosition(newPosition);
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      if (onPositionChange && wasDragged.current) {
        onPositionChange(position);
      }

      // Для разблокированных: если не было драга - клик
      if (!wasDragged.current) {
        onClick(e);
      }

      wasDragged.current = false;
    }
  };

  // ОТДЕЛЬНЫЙ обработчик клика для заблокированных значков
  const handleClick = (e) => {
    if (isLocked) {
      onClick(e);
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => handleMouseMove(e);
      const handleGlobalMouseUp = (e) => handleMouseUp(e);

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={iconRef}
      className="desktop-icon"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{
        cursor: isLocked ? "pointer" : "grab",
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="icon">{icon}</div>
      <span>{title}</span>
      {isLocked && (
        <div className="lock-overlay">
          <span className="lock-indicator">🔒</span>
        </div>
      )}
    </div>
  );
};

export default DesktopIcon;
