// Centralized media utility for video and image asset resolution

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "nassz3ed";
const USE_CLOUDINARY = import.meta.env.VITE_USE_CLOUDINARY === "true";

/**
 * Returns optimized media asset URL.
 * Automatically handles Cloudinary formatting and local /public fallbacks.
 *
 * @param {string} path - Local path (e.g., "/hero_loop.mp4" or "/canopy.avif") or remote URL
 * @param {'video' | 'image'} [type='video'] - Media type for Cloudinary bucket routing
 * @returns {string} Fully formatted asset URL
 */
export function getMediaUrl(path, type = "video") {
  if (!path) return "";

  // Return full HTTP/HTTPS URLs directly
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanFilename = path.startsWith("/") ? path.slice(1) : path;

  // Use Cloudinary if explicitly enabled or if Cloud Name is configured
  if (USE_CLOUDINARY && CLOUDINARY_CLOUD_NAME) {
    const bucket = type === "image" ? "image" : "video";
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${bucket}/upload/f_auto,q_auto/${cleanFilename}`;
  }

  // Default to local public asset path
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Fallback architecture placeholder image for broken links
 */
export const FALLBACK_IMAGE = "/canopy.avif";
