export const getImageUrl = (path, fallbackName = "User") => {
  if (!path) {
    return `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&name=${encodeURIComponent(fallbackName)}`;
  }
  // Already absolute URL
  if (path.startsWith("http")) return path;

  const apiUrl = import.meta.env.VITE_API_URL;
  // Only build absolute URL if a real backend origin is configured (not just "/api")
  if (apiUrl && apiUrl.startsWith("http")) {
    const baseUrl = apiUrl.replace(/\/api$/, "").replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }

  // Default: relative path (works with Vite proxy or same-origin serving)
  return path.startsWith("/") ? path : `/${path}`;
};