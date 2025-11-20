export class MemoryDO {
  constructor(state, env) {
    this.state = state
    this.env = env
  }

  async fetch(request) {
    const url = new URL(request.url)
    const path = url.pathname

    // Get or create storage
    const storage = await this.state.storage

    if (request.method === 'GET') {
      // Get memory for a user
      const userId = url.searchParams.get('userId') || 'default'
      const movieId = url.searchParams.get('movieId') || 'default'
      const key = `memory:${userId}:${movieId}`

      const memory = await storage.get(key) || {
        questions: [],
        responses: [],
        progress: 0
      }

      return new Response(JSON.stringify(memory), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST') {
      // Save memory for a user
      const data = await request.json()
      const { userId = 'default', movieId = 'default', question, answer, timestamp, currentTime } = data

      const key = `memory:${userId}:${movieId}`
      const existing = await storage.get(key) || {
        questions: [],
        responses: [],
        progress: 0
      }

      // Add new entry
      existing.questions.push({
        question,
        timestamp: currentTime,
        askedAt: Date.now()
      })

      existing.responses.push({
        answer,
        timestamp: timestamp || null,
        respondedAt: Date.now()
      })

      existing.progress = Math.max(existing.progress, currentTime || 0)

      await storage.put(key, existing)

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response('Method not allowed', { status: 405 })
  }
}

