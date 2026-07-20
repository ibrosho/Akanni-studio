import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only run once per session
    const hasSeen = sessionStorage.getItem('akanni_preloaded');
    if (hasSeen) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const duration = 1800; // 1.8s count up
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      const progress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setCount(progress);

      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsVisible(false);
          sessionStorage.setItem('akanni_preloaded', 'true');
          if (onComplete) onComplete();
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center pointer-events-auto select-none"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-radial from-accent/10 via-transparent to-transparent opacity-40 pointer-events-none" />

          {/* Center Logo & Counter Layout */}
          <div className="relative z-10 flex flex-col items-center max-w-xs text-center px-6">
            
            {/* SVG Logo Assembly */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="w-16 h-16 border border-accent/40 rounded-2xl flex items-center justify-center bg-accent/5 backdrop-blur-md shadow-[0_0_25px_rgba(0,245,212,0.15)] relative">
                <span className="font-mono text-2xl font-black tracking-tighter text-white">
                  A<span className="text-accent">S</span>
                </span>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-ping" />
              </div>
            </motion.div>

            {/* Typography Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <p className="text-[10px] font-mono tracking-[0.35em] text-accent uppercase mb-1">
                Akanni Studios
              </p>
              <p className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                Spatial Architecture Engine
              </p>
            </motion.div>

            {/* Percentage Counter */}
            <div className="w-full flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
              <span className="text-zinc-600">Initialization</span>
              <span className="text-accent font-bold text-lg tabular-nums">{count}%</span>
            </div>

            {/* Thin Progress Bar Container */}
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-accent shadow-[0_0_12px_rgba(0,245,212,0.8)]"
                style={{ width: `${count}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

          </div>

          {/* Footer Metadata Tag */}
          <div className="absolute bottom-8 font-mono text-[8px] tracking-[0.3em] text-zinc-600 uppercase">
            System Core v2.4.0 — All Systems Nominal
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
