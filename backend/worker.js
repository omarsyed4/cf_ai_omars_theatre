import { MemoryDO } from './durableObject.js'
import { handleTranscribe, handleQuery, handleMemory } from './aiHandlers.js'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    try {
      // Route handling
      if (path === '/api/transcribe' && request.method === 'POST') {
        return handleTranscribe(request, env, corsHeaders)
      }

      if (path === '/api/query' && request.method === 'POST') {
        return handleQuery(request, env, corsHeaders)
      }

      if (path.startsWith('/api/memory') && (request.method === 'GET' || request.method === 'POST')) {
        return handleMemory(request, env, corsHeaders)
      }

      if (path.startsWith('/api/scripts/') && request.method === 'GET') {
        // Serve script files
        const scriptId = path.split('/api/scripts/')[1]
        return handleScriptRequest(scriptId, corsHeaders)
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders })
    } catch (error) {
      console.error('Error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
  }
}

// Durable Object binding
export { MemoryDO }

// Helper to serve script files
async function handleScriptRequest(scriptId, corsHeaders) {
  // In production, these would be stored in KV or served from static assets
  // For now, we'll return a placeholder that the frontend can handle
  const scripts = {
    'movie1': '/src/assets/scripts/movie1.json',
    'movie2': '/src/assets/scripts/movie2.json',
    'movie3': '/src/assets/scripts/movie3.json',
    'movie4': '/src/assets/scripts/movie4.json',
  }

  return new Response(
    JSON.stringify({ path: scripts[scriptId] || null }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

