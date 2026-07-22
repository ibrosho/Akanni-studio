import React, { useState, useEffect, useRef } from 'react';
import OptimizedImage from './OptimizedImage';

/**
 * Reusable Optimized Video component with instant image backdrop,
 * crystal-clear video cross-fade (hiding backdrop when video is ready),
 * zero blur interference, and zero modal glitches.
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
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Attempt playback when video data is ready
  useEffect(() => {
    if (videoRef.current && isVideoReady && !hasError) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`[OptimizedVideo] Autoplay note for ${src}:`, err);
        });
      }
    }
  }, [isVideoReady, hasError, src]);

  const handleVideoReady = () => {
    setIsVideoReady(true);
    setHasError(false);
  };

  const handleVideoError = () => {
    console.warn(`[OptimizedVideo] Video stream unavailable for ${src}, maintaining photo backdrop.`);
    setHasError(true);
    setIsVideoReady(false);
  };

  return (
    <div
      className={`relative overflow-hidden bg-zinc-950 ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* 1. Instant High-Resolution Image Backdrop — Fades out cleanly when video is ready */}
      {poster && (
        <OptimizedImage
          src={poster}
          alt={alt}
          priority
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isVideoReady ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* 2. HTML5 Video Layer — Crystal-clear foreground when ready */}
      {src && !hasError && (
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
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            isVideoReady ? 'opacity-100 z-10' : 'opacity-0 z-0'
          } ${videoClassName}`}
        />
      )}
    </div>
  );
});

export default OptimizedVideo;
