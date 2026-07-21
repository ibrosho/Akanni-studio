// Global Asset Preloader Utility & Memory Cache

const loadedAssetsCache = new Set();

/**
 * Checks synchronously if an asset URL has already been preloaded
 * @param {string} src 
 * @returns {boolean}
 */
export function isAssetPreloaded(src) {
  if (!src) return false;
  return loadedAssetsCache.has(src);
}

/**
 * Preloads a single image and caches its ready state
 * @param {string} src 
 * @returns {Promise<string>}
 */
export function preloadImage(src) {
  if (!src) return Promise.resolve("");
  if (loadedAssetsCache.has(src)) return Promise.resolve(src);

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      loadedAssetsCache.add(src);
      resolve(src);
    };

    img.onerror = () => {
      console.warn(`[AssetPreloader] Image failed to preload: ${src}`);
      resolve(src); // Resolve anyway so UI is not blocked
    };
  });
}

/**
 * Preloads a single video asset and caches ready state
 * @param {string} src 
 * @returns {Promise<string>}
 */
export function preloadVideo(src) {
  if (!src) return Promise.resolve("");
  if (loadedAssetsCache.has(src)) return Promise.resolve(src);

  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = src;
    video.preload = "auto";
    video.muted = true;

    const onReady = () => {
      loadedAssetsCache.add(src);
      cleanup();
      resolve(src);
    };

    const onError = () => {
      console.warn(`[AssetPreloader] Video failed to preload: ${src}`);
      cleanup();
      resolve(src);
    };

    const cleanup = () => {
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("canplaythrough", onReady, { once: true });
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });

    // Fallback timeout in case video event doesn't fire immediately
    setTimeout(() => {
      loadedAssetsCache.add(src);
      cleanup();
      resolve(src);
    }, 4000);
  });
}

/**
 * Batch preloads an array of image and video URLs concurrently
 * @param {string[]} urls 
 * @returns {Promise<void>}
 */
export async function preloadAssetList(urls = []) {
  const validUrls = urls.filter(Boolean);
  const tasks = validUrls.map((url) => {
    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.includes("/video/upload/")) {
      return preloadVideo(url);
    }
    return preloadImage(url);
  });

  await Promise.allSettled(tasks);
}
