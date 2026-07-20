// Centralized media utility for Cloudinary CDN delivery & local fallback

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL || "";

/**
 * Transforms local media paths (e.g. "/hero_loop.mp4") into optimized Cloudinary CDN URLs.
 * Automatically applies Cloudinary `f_auto,q_auto` for fast streaming, optimal WebM/MP4 format,
 * and adaptive compression.
 *
 * @param {string} path - Local path (e.g., "/hero_loop.mp4") or full remote URL
 * @returns {string} Optimized CDN URL or original local path
 */
export function getMediaUrl(path) {
  if (!path) return "";
  
  // If already a full http/https URL, return directly
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If a custom Cloudinary base URL is defined
  if (CLOUDINARY_BASE_URL) {
    const filename = path.startsWith("/") ? path.slice(1) : path;
    const cleanBase = CLOUDINARY_BASE_URL.endsWith("/") ? CLOUDINARY_BASE_URL.slice(0, -1) : CLOUDINARY_BASE_URL;
    return `${cleanBase}/${filename}`;
  }

  // If Cloudinary cloud name is provided
  if (CLOUDINARY_CLOUD_NAME) {
    const filename = path.startsWith("/") ? path.slice(1) : path;
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/f_auto,q_auto/${filename}`;
  }

  // Fallback to local path
  return path;
}
