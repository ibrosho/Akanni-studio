import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

/**
 * Reusable Optimized Video component with IntersectionObserver viewport loading,
 * mandatory autoplay/muted/playsInline/loop/preload="auto" attributes,
 * skeleton loaders, zero-black-box image backdrop, and error logging.
 */
export const OptimizedVideo = React.memo(function OptimizedVideo({
  src,
  poster,
  alt = 'Architectural video loop',
  className = '',
  videoClassName = '',
  onClick,
  showPlayIndicator = false,
  ...props
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [isInView, setIsInView] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // IntersectionObserver for Viewport Lazy Video Loading
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          // Pause video when out of viewport to save resources
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Play video when in view and ready
  useEffect(() => {
    if (isInView && videoRef.current && isVideoReady && !hasError) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`[OptimizedVideo] Autoplay blocked or failed for ${src}:`, err);
        });
      }
    }
  }, [isInView, isVideoReady, hasError, src]);

  const handleVideoReady = () => {
    setIsVideoReady(true);
    setHasError(false);
  };

  const handleVideoError = (e) => {
    console.warn(`[OptimizedVideo] Failed to load or stream video: ${src}`, e);
    setHasError(true);
    setIsVideoReady(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-zinc-950 ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* 1. Instant High-Resolution Image Backdrop */}
      {poster && (
        <OptimizedImage
          src={poster}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* 2. Loading Skeleton overlay while video buffers */}
      <AnimatePresence>
        {isInView && !isVideoReady && !hasError && (
          <motion.div
            initial={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none"
          >
            <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HTML5 Video Layer with mandatory attributes */}
      {isInView && src && !hasError && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          onCanPlay={handleVideoReady}
          onLoadedData={handleVideoReady}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          } ${videoClassName}`}
        />
      )}

      {/* 4. Optional Play Icon Indicator if video fails or on hover */}
      {showPlayIndicator && (hasError || !isVideoReady) && (
        <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 text-white/80">
          <Play size={12} fill="currentColor" />
        </div>
      )}
    </div>
  );
});

export default OptimizedVideo;
