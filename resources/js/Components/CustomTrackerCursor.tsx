import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
}

export const CustomTrackerCursor: React.FC<CustomTrackerCursorProps> = ({
  element,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
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

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [onMouseEnter, onMouseLeave, onMouseMove]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
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
                    ease: [0.17, 0.67, 0.83, 0.67], // Smooth bezier curve
                    duration: 0.15,
                  }}
                  className="pointer-events-none absolute"
                  style={{
                    transform: `translate(-50%, -50%)`,
                    left: 0,
                    top: 0,
                    willChange: 'transform', // Optimization for smooth movement
                  }}
                >
                  {element}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};
