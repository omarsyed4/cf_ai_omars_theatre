// API Configuration
// In production, use the full Worker URL
// In development, use relative paths (handled by Vite proxy)

const API_BASE = import.meta.env.PROD
  ? "https://omars-theater-backend.omarsyed0504.workers.dev"
  : ""; // Empty string uses relative paths, which Vite proxies to localhost:8787

export default API_BASE;

