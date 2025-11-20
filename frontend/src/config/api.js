// API Configuration
// In production, use the full Worker URL
// In development, use relative paths (handled by Vite proxy)

// Check if we're in development (localhost) or production
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE = isDevelopment
  ? "" // Empty string uses relative paths, which Vite proxies to localhost:8787
  : "https://omars-theater-backend.omarsyed0504.workers.dev"; // Production Worker URL

export default API_BASE;

