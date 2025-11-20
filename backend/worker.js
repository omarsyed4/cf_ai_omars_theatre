import { MemoryDO } from './durableObject.js'
import { handleQuery, handleMemory } from './aiHandlers.js'

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
      if (path === '/api/query' && request.method === 'POST') {
        return handleQuery(request, env, corsHeaders)
      }

      if (path.startsWith('/api/memory') && (request.method === 'GET' || request.method === 'POST')) {
        return handleMemory(request, env, corsHeaders)
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

