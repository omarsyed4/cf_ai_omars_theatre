// Load script from R2 or fetch from public URL
async function loadScript(movieId, env) {
  try {
    // Try to load from R2 first
    if (env.FILMS) {
      const scriptKey = `${movieId}/script.json`
      const script = await env.FILMS.get(scriptKey)
      if (script) {
        return JSON.parse(await script.text())
      }
    }
    
    // Fallback to fetching from public URL
    const scriptUrls = {
      'black-hole': 'https://pub-04a0de5f81b649f9abb5465eb19addbd.r2.dev/black-hole/script.json',
      'alma': 'https://pub-04a0de5f81b649f9abb5465eb19addbd.r2.dev/alma/script.json',
      'cargo': 'https://pub-04a0de5f81b649f9abb5465eb19addbd.r2.dev/cargo/cargo.json'
    }
    
    const scriptUrl = scriptUrls[movieId]
    if (!scriptUrl) {
      throw new Error(`No script URL found for movie: ${movieId}`)
    }
    
    const response = await fetch(scriptUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch script: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error loading script:', error)
    throw error
  }
}

// Filter script entries up to timestamp
function filterScriptUpToTimestamp(script, timestamp) {
  if (!Array.isArray(script)) {
    return []
  }
  
  return script.filter(entry => {
    const entryTime = typeof entry.timestamp === 'number' ? entry.timestamp : parseInt(entry.timestamp)
    return entryTime <= timestamp
  })
}

// Format script for prompt
function formatScriptForPrompt(scriptEntries) {
  return scriptEntries.map(entry => {
    const time = typeof entry.timestamp === 'number' ? entry.timestamp : parseInt(entry.timestamp)
    const mins = Math.floor(time / 60)
    const secs = time % 60
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`
    return `[${timeStr}] ${entry.content || entry.text || ''}`
  }).join('\n')
}

// Format timestamp for display
function formatTimestamp(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Handle AI query
export async function handleQuery(request, env, corsHeaders) {
  try {
    const body = await request.json()
    const { question, timestamp, movieId } = body
    
    console.log('[AI Handler] Received query:', { question, timestamp, movieId })
    
    if (!question || timestamp === undefined || !movieId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: question, timestamp, movieId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Load script
    console.log('[AI Handler] Loading script for movie:', movieId)
    const script = await loadScript(movieId, env)
    console.log('[AI Handler] Script loaded, entries:', script.length)
    
    // Filter script up to timestamp
    const relevantScript = filterScriptUpToTimestamp(script, timestamp)
    console.log('[AI Handler] Filtered script entries up to timestamp:', relevantScript.length)
    
    // Format script for prompt
    const scriptText = formatScriptForPrompt(relevantScript)
    const timestampFormatted = formatTimestamp(timestamp)
    
    // Build prompt
    const prompt = `You are an AI assistant helping a viewer understand a movie. The viewer paused the movie at ${timestampFormatted} (${timestamp} seconds).

Here is the script up to this exact moment:

${scriptText}

The viewer asked: "${question}"

IMPORTANT RULES:
1. Answer ONLY based on what has happened up to ${timestampFormatted} (${timestamp} seconds). DO NOT spoil anything that happens after this point.
2. If the answer involves something that happened earlier in the movie, provide the timestamp (in seconds) when it occurred.
3. If the question is about something that hasn't been revealed yet, tell them to keep watching.
4. Be concise and helpful.
5. If you reference a specific moment, format it as: "This was mentioned at [timestamp in seconds] seconds."

Your response:`
    
    console.log('[AI Handler] Sending prompt to AI model')
    
    // Call Workers AI
    const aiResponse = await env.AI.run(
      '@cf/meta/llama-3.1-70b-instruct',
      {
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }
    )
    
    console.log('[AI Handler] AI response received:', aiResponse)
    
    // Extract answer from response
    let answer = ''
    if (aiResponse.response) {
      answer = aiResponse.response
    } else if (typeof aiResponse === 'string') {
      answer = aiResponse
    } else if (aiResponse.text) {
      answer = aiResponse.text
    } else {
      answer = JSON.stringify(aiResponse)
    }
    
    // Extract timestamp if mentioned in answer
    const timestampMatch = answer.match(/at (\d+) seconds?/i)
    const referencedTimestamp = timestampMatch ? parseInt(timestampMatch[1]) : null
    
    // Save to memory (optional, using Durable Objects)
    try {
      const userId = body.userId || 'default'
      const id = env.MEMORY.idFromName(`${userId}-${movieId}`)
      const stub = env.MEMORY.get(id)
      
      await stub.fetch(new Request('http://memory/internal', {
        method: 'POST',
        body: JSON.stringify({
          question,
          answer,
          timestamp,
          currentTime: timestamp
        })
      }))
    } catch (memoryError) {
      console.warn('[AI Handler] Failed to save to memory:', memoryError)
      // Don't fail the request if memory save fails
    }
    
    return new Response(
      JSON.stringify({
        answer: answer.trim(),
        timestamp: referencedTimestamp
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('[AI Handler] Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle memory operations
export async function handleMemory(request, env, corsHeaders) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId') || 'default'
    const movieId = url.searchParams.get('movieId') || 'default'
    
    const id = env.MEMORY.idFromName(`${userId}-${movieId}`)
    const stub = env.MEMORY.get(id)
    
    if (request.method === 'GET') {
      const response = await stub.fetch(new Request('http://memory/internal'))
      const data = await response.json()
      
      return new Response(
        JSON.stringify(data),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    if (request.method === 'POST') {
      const body = await request.json()
      const response = await stub.fetch(new Request('http://memory/internal', {
        method: 'POST',
        body: JSON.stringify(body)
      }))
      
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  } catch (error) {
    console.error('[Memory Handler] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

