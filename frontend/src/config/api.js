// API Configuration
// In production, use the full Worker URL
// In development, use relative paths (handled by Vite proxy)

const WORKER_URL = "https://omars-theater-backend.omarsyed0504.workers.dev";

// Function to get API base URL (evaluated at runtime, not build time)
function getApiBase() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return WORKER_URL; // SSR fallback
  }

  const hostname = window.location.hostname;
  const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost');
  
  // Debug logging
  console.log('[API Config] Hostname:', hostname);
  console.log('[API Config] isDevelopment:', isDevelopment);
  console.log('[API Config] import.meta.env.DEV:', import.meta.env.DEV);
  console.log('[API Config] import.meta.env.PROD:', import.meta.env.PROD);
  console.log('[API Config] import.meta.env.MODE:', import.meta.env.MODE);
  
  const apiBase = isDevelopment ? "" : WORKER_URL;
  console.log('[API Config] API_BASE:', apiBase);
  
  return apiBase;
}

// Export the function result (evaluated at module load time in browser)
const API_BASE = getApiBase();

export default API_BASE;

