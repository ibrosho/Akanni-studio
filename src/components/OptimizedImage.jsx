import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isAssetPreloaded, preloadImage } from '../utils/preloader';
import { FALLBACK_IMAGE } from '../config/media';

/**
 * Reusable Optimized Image component with Framer Motion skeleton,
 * instant cached rendering, blur-to-sharp animation, and error fallbacks.
 */
export const OptimizedImage = React.memo(function OptimizedImage({
  src,
  alt = 'Architecture asset',
  className = '',
  imageClassName = '',
  onClick,
  priority = false,
  ...props
}) {
  const isPreloaded = priority || isAssetPreloaded(src);
  const [isLoaded, setIsLoaded] = useState(isPreloaded);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    if (!src) return;
    setCurrentSrc(src);

    if (priority || isAssetPreloaded(src)) {
      setIsLoaded(true);
    } else {
      preloadImage(src).then(() => {
        setIsLoaded(true);
      });
    }
  }, [src, priority]);

  const handleError = () => {
    console.warn(`[OptimizedImage] Failed to load image: ${currentSrc}. Falling back to default.`);
    setCurrentSrc(FALLBACK_IMAGE);
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick} {...props}>
      {/* Animated Shimmer Skeleton Loader */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-zinc-900 overflow-hidden z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-shimmer" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rendered Image with Framer Motion Blur-to-Sharp Fade In */}
      <motion.img
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        initial={isPreloaded ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
        animate={isLoaded ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full h-full object-cover ${imageClassName}`}
      />
    </div>
  );
});

export default OptimizedImage;
