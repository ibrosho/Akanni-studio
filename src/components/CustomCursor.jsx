import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState("default");
  const [isTouchDevice, setIsTouchDevice] = useState(
    () => window.matchMedia('(pointer: coarse)').matches
  );
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('arc_cursor_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // Use motion values for smooth, hardware-accelerated movement
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Add a spring effect to make the cursor smoothly "lag" behind the pointer elegantly
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // 1. Subscribe to touch device changes dynamically
  useEffect(() => {
    const touchQuery = window.matchMedia('(pointer: coarse)');
    const handleTouchChange = (e) => setIsTouchDevice(e.matches);
    touchQuery.addEventListener('change', handleTouchChange);
    
    // Subscribe to cursor toggle configurations
    const handleCursorToggle = () => {
      const saved = localStorage.getItem('arc_cursor_enabled');
      setIsEnabled(saved !== null ? JSON.parse(saved) : true);
    };
    window.addEventListener('cursor-toggle', handleCursorToggle);

    return () => {
      touchQuery.removeEventListener('change', handleTouchChange);
      window.removeEventListener('cursor-toggle', handleCursorToggle);
    };
  }, []);

  useEffect(() => {
    // If it's a mobile or touch device, do not set up mouse listeners
    if (isTouchDevice || !isEnabled) return;

    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', moveCursor);
    
    // Add event listeners to global body to detect special hovers
    const handleMouseOver = (e) => {
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.cursor-pointer')) {
        setCursorType("pointer");
      } else if (e.target.closest('.project-card') || e.target.closest('.group')) {
        setCursorType("project");
      } else {
        setCursorType("default");
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isTouchDevice, isEnabled]);

  // Hide default cursor globally, BUT only on desktop and if enabled!
  useEffect(() => {
    if (isTouchDevice || !isEnabled) {
      document.body.style.cursor = 'auto';
      return;
    }

    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isTouchDevice, isEnabled]);

  // 2. Safely bail out and render nothing on touch screens or if disabled
  if (isTouchDevice || !isEnabled) return null;

  // Frame variants for the cursor morphing states
  const variants = {
    default: {
      width: 8,
      height: 8,
      backgroundColor: "rgba(255, 255, 255, 1)",
      border: "0px solid rgba(255,255,255,0)"
    },
    pointer: {
      width: 40,
      height: 40,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    },
    project: {
      width: 90,
      height: 90,
      backgroundColor: "rgba(34, 211, 238, 0.08)", // Cyan-400 tint
      border: "1px solid rgba(34, 211, 238, 0.4)",
    }
  };

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          borderRadius: '50%',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mixBlendMode: cursorType === "pointer" ? 'difference' : 'normal'
        }}
        animate={cursorType}
        variants={variants}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        {/* If hovering over a project, elegantly render a floating tag inside the cursor */}
        {cursorType === "project" && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[8px] font-mono tracking-widest text-cyan-400 uppercase font-bold"
          >
            View
          </motion.span>
        )}
      </motion.div>
      {/* Tiny Inner Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: 4,
          height: 4,
          backgroundColor: '#22d3ee', // Glowing cyan core
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
      />
    </>
  );
}