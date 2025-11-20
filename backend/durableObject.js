export class MemoryDO {
  constructor(state, env) {
    this.state = state
    this.env = env
  }

  async fetch(request) {
    const url = new URL(request.url)
    
    // Handle internal memory operations
    if (url.pathname === '/internal') {
      if (request.method === 'GET') {
        // Get conversation history
        const history = await this.state.storage.get('history') || []
        return new Response(JSON.stringify({ history }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      if (request.method === 'POST') {
        // Add to conversation history
        const data = await request.json()
        const history = await this.state.storage.get('history') || []
        history.push({
          question: data.question,
          answer: data.answer,
          timestamp: data.timestamp,
          currentTime: data.currentTime
        })
        await this.state.storage.put('history', history)
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }
    
    return new Response('Method not allowed', { status: 405 })
  }
}

