// Centralized media utility for video delivery & local fallback

const USE_CLOUDINARY = import.meta.env.VITE_USE_CLOUDINARY === "true";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

/**
 * Returns optimized video asset path.
 * Uses lightweight local video files in /public by default for 100% reliable playback without 404s.
 *
 * @param {string} path - Local path (e.g., "/hero_loop.mp4") or full remote URL
 * @returns {string} Clean local asset path or CDN URL
 */
export function getMediaUrl(path) {
  if (!path) return "";
  
  // If already a full http/https URL, return directly
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If Cloudinary is explicitly enabled and cloud name is set
  if (USE_CLOUDINARY && CLOUDINARY_CLOUD_NAME) {
    const filename = path.startsWith("/") ? path.slice(1) : path;
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto/${filename}`;
  }

  // Default to lightweight local video path in /public
  return path;
}
