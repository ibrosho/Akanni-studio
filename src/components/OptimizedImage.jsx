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
  const isPreloaded = isAssetPreloaded(src);
  const [isLoaded, setIsLoaded] = useState(isPreloaded);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    if (!src) return;
    setCurrentSrc(src);
    setHasError(false);

    if (isAssetPreloaded(src)) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
      preloadImage(src).then(() => {
        setIsLoaded(true);
      });
    }
  }, [src]);

  const handleError = () => {
    console.warn(`[OptimizedImage] Failed to load image: ${currentSrc}. Falling back to default.`);
    setHasError(true);
    setCurrentSrc(FALLBACK_IMAGE);
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick} {...props}>
      {/* Animated Skeleton Loader */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-zinc-900 overflow-hidden z-10 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-shimmer" />
            <div className="w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
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
        initial={isPreloaded ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
        animate={isLoaded ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full h-full object-cover ${imageClassName}`}
      />
    </div>
  );
});

export default OptimizedImage;
