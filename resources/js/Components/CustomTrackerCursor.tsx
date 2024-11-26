import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface CustomTrackerCursorProps {
  element: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onMouseMove?: (position: MousePosition) => void;
  onClick?: (position: MousePosition) => void;
  onDoubleClick?: (position: MousePosition) => void;
  onSelect?: (selection: Selection | null) => void;
}

export const CustomTrackerCursor: React.FC<CustomTrackerCursorProps> = ({
  element,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
  onDoubleClick,
  onSelect,
}) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [entryPosition, setEntryPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const newPosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setMousePosition(newPosition);
      onMouseMove?.(newPosition);
    };

    const handleMouseEnter = (e: MouseEvent): void => {
      const rect = container.getBoundingClientRect();
      const entryPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setEntryPosition(entryPos);
      setMousePosition(entryPos);
      setIsHovering(true);
      onMouseEnter?.();
    };

    const handleMouseLeave = (): void => {
      setIsHovering(false);
      onMouseLeave?.();
    };

    const handleClick = (e: MouseEvent): void => {
      const rect = container.getBoundingClientRect();
      const clickPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      onClick?.(clickPos);
    };

    const handleDoubleClick = (e: MouseEvent): void => {
      const rect = container.getBoundingClientRect();
      const clickPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      onDoubleClick?.(clickPos);
    };

    const handleSelection = (): void => {
      const selection = window.getSelection();
      onSelect?.(selection);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);
    container.addEventListener('dblclick', handleDoubleClick);
    document.addEventListener('selectionchange', handleSelection);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('dblclick', handleDoubleClick);
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, [
    onClick,
    onDoubleClick,
    onSelect,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  ]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <AnimatePresence mode="wait">
        {isHovering && (
          <motion.div
            initial={{
              opacity: 0,
              x: entryPosition.x,
              y: entryPosition.y,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              x: mousePosition.x,
              y: mousePosition.y,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.15 },
            }}
            transition={{
              type: 'tween',
              ease: [0.17, 0.67, 0.83, 0.67],
              duration: 0.15,
            }}
            className="pointer-events-none absolute"
            style={{
              transform: `translate(-50%, -50%)`,
              left: 0,
              top: 0,
              willChange: 'transform',
            }}
          >
            {element}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
