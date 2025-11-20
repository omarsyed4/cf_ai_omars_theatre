// API Configuration
// In production, use the full Worker URL
// In development, use relative paths (handled by Vite proxy)

// Check if we're in development (localhost) or production
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isDevelopment = import.meta.env.DEV || hostname === 'localhost' || hostname === '127.0.0.1';

const API_BASE = isDevelopment
  ? "" // Empty string uses relative paths, which Vite proxies to localhost:8787
  : "https://omars-theater-backend.omarsyed0504.workers.dev"; // Production Worker URL

// Debug logging
if (typeof window !== 'undefined') {
  console.log('[API Config] Hostname:', hostname);
  console.log('[API Config] isDevelopment:', isDevelopment);
  console.log('[API Config] import.meta.env.DEV:', import.meta.env.DEV);
  console.log('[API Config] import.meta.env.PROD:', import.meta.env.PROD);
  console.log('[API Config] API_BASE:', API_BASE);
}

export default API_BASE;

