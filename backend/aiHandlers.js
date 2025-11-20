// Script data - in production, this would be loaded from R2 or KV
// For now, scripts are embedded. To load from R2, fetch from: https://<r2-public-url>/<movie-id>/script.json
const SCRIPTS = {
  'black-hole': [
    { timestamp: 0, content: "A tired office worker sits alone at his desk late at night, printing documents on a copier.", entities: ["Man", "Office", "Copier"] },
    { timestamp: 12, content: "The man notices a mysterious black circular hole has appeared on one of the printed pages.", entities: ["Man", "Black Hole", "Printed Page"] },
    { timestamp: 18, content: "He picks up the page and examines the black hole, which appears to be a physical void on the paper.", entities: ["Man", "Black Hole"] },
    { timestamp: 25, content: "Curious, the man tests the hole by pushing his finger through it, discovering it's a portal.", entities: ["Man", "Black Hole"] },
    { timestamp: 35, content: "He pushes his entire hand through the black hole, confirming it can penetrate solid objects.", entities: ["Man", "Black Hole"] },
    { timestamp: 45, content: "The man realizes the black hole can be used to reach through surfaces. He tests it on his desk.", entities: ["Man", "Black Hole", "Desk"] },
    { timestamp: 55, content: "He places the page with the black hole on the vending machine and reaches through to grab a snack.", entities: ["Man", "Black Hole", "Vending Machine"] },
    { timestamp: 68, content: "The man places the black hole page on the office safe, planning to reach inside.", entities: ["Man", "Black Hole", "Safe"] },
    { timestamp: 75, content: "He reaches through the black hole into the safe and retrieves stacks of money.", entities: ["Man", "Black Hole", "Safe", "Money"] },
    { timestamp: 90, content: "Greed takes over. The man decides to climb through the black hole himself to get more money.", entities: ["Man", "Black Hole", "Safe", "Money"] },
    { timestamp: 105, content: "He attempts to crawl through the black hole, but it's too small for his body.", entities: ["Man", "Black Hole"] },
    { timestamp: 120, content: "The man tries to force himself through the black hole, pushing harder.", entities: ["Man", "Black Hole"] },
    { timestamp: 135, content: "The black hole begins to stretch and deform as the man forces his way through.", entities: ["Man", "Black Hole"] },
    { timestamp: 148, content: "The man gets stuck halfway through the black hole, trapped between dimensions.", entities: ["Man", "Black Hole"] },
    { timestamp: 150, content: "The black hole collapses, leaving the man permanently trapped, with only his legs visible on the office floor.", entities: ["Man", "Black Hole", "Office"] }
  ],
  'alma': [
    { timestamp: 0, content: "A young girl named Alma walks down a snowy street, pulling a sled behind her.", entities: ["Alma", "Sled", "Street"] },
    { timestamp: 10, content: "Alma notices a chalkboard on the street with her name written on it, surrounded by other names.", entities: ["Alma", "Chalkboard"] },
    { timestamp: 20, content: "She erases her name from the chalkboard, then continues walking down the empty street.", entities: ["Alma", "Chalkboard"] },
    { timestamp: 33, content: "Alma discovers a mysterious toy shop with a window full of dolls. The shop appears to be closed.", entities: ["Alma", "Toy Shop", "Dolls"] },
    { timestamp: 45, content: "She presses her face against the window, fascinated by the dolls inside, especially one that looks exactly like her.", entities: ["Alma", "Dolls", "Toy Shop"] },
    { timestamp: 60, content: "Alma tries the door handle, but the shop is locked. She looks around, then tries again.", entities: ["Alma", "Toy Shop"] },
    { timestamp: 75, content: "The door suddenly opens on its own. Alma hesitates, then enters the dark toy shop.", entities: ["Alma", "Toy Shop"] },
    { timestamp: 85, content: "Inside, the shop is filled with shelves of dolls and toys. Alma walks through the aisles.", entities: ["Alma", "Toy Shop", "Dolls"] },
    { timestamp: 91, content: "Alma approaches the doll that looks exactly like her, which is positioned on a high shelf.", entities: ["Alma", "Dolls"] },
    { timestamp: 105, content: "She reaches up to touch the doll, but it's just out of reach. She stands on her toes.", entities: ["Alma", "Dolls"] },
    { timestamp: 120, content: "Alma notices the doll's eyes are following her movements. The doll seems alive.", entities: ["Alma", "Dolls"] },
    { timestamp: 135, content: "She tries to grab the doll, but it moves slightly out of reach each time.", entities: ["Alma", "Dolls"] },
    { timestamp: 150, content: "Alma climbs onto a nearby toy to get closer to the doll on the shelf.", entities: ["Alma", "Dolls", "Toy Shop"] },
    { timestamp: 165, content: "She finally touches the doll's hand. The doll's finger moves and touches her hand back.", entities: ["Alma", "Dolls"] },
    { timestamp: 180, content: "Alma's hand becomes stuck to the doll's hand. She tries to pull away but cannot.", entities: ["Alma", "Dolls"] },
    { timestamp: 195, content: "Her entire body begins to be pulled toward the doll. She struggles but is powerless.", entities: ["Alma", "Dolls"] },
    { timestamp: 210, content: "Alma is pulled completely inside the doll's body. Her consciousness transfers into the doll.", entities: ["Alma", "Dolls"] },
    { timestamp: 230, content: "The doll on the shelf now has Alma's eyes and expression. She is trapped inside.", entities: ["Alma", "Dolls"] },
    { timestamp: 250, content: "A new doll appears on the shelf below, identical to the original Alma, ready for the next victim.", entities: ["Dolls", "Toy Shop"] },
    { timestamp: 260, content: "The camera pulls back, revealing the toy shop window from outside, with Alma now as a doll inside.", entities: ["Alma", "Dolls", "Toy Shop"] },
    { timestamp: 270, content: "Another child approaches the shop, drawn to the window, beginning the cycle again.", entities: ["Toy Shop", "Dolls"] },
    { timestamp: 330, content: "The cycle continues as the toy shop waits for its next victim.", entities: ["Toy Shop", "Dolls"] }
  ],
  'cargo': [
    { timestamp: 0, content: "A father wakes up in a car, discovering he has been bitten. His wife is already transformed into a zombie.", entities: ["Father", "Wife", "Infection", "Baby"] },
    { timestamp: 15, content: "The father realizes he is infected and has limited time before he transforms. His baby is in the backseat.", entities: ["Father", "Baby", "Infection"] },
    { timestamp: 30, content: "The father looks at a map, planning his route. He knows he must get his baby to safety before he turns.", entities: ["Father", "Baby", "Map"] },
    { timestamp: 50, content: "The father creates a baby carrier using a backpack, positioning the baby on his back with a bottle of food attached to a stick.", entities: ["Father", "Baby", "Baby Carrier"] },
    { timestamp: 70, content: "He writes a note and attaches it to the baby carrier, explaining the situation and asking for help.", entities: ["Father", "Baby", "Note"] },
    { timestamp: 90, content: "The father begins walking through the Australian outback, following a scent trail left by survivors.", entities: ["Father", "Baby", "Survivors", "Outback"] },
    { timestamp: 110, content: "As he walks, the infection progresses. The father's movements become more zombie-like.", entities: ["Father", "Infection"] },
    { timestamp: 130, content: "The father follows the scent markers - pieces of cloth tied to trees - left by the survivors.", entities: ["Father", "Survivors", "Scent Trail"] },
    { timestamp: 150, content: "He continues walking, the baby safely on his back, feeding from the bottle attached to the stick.", entities: ["Father", "Baby"] },
    { timestamp: 180, content: "The father's transformation accelerates. He stumbles but keeps moving forward, driven by instinct to protect the baby.", entities: ["Father", "Baby", "Infection"] },
    { timestamp: 210, content: "He reaches a river and crosses it, still following the scent trail toward the survivors' camp.", entities: ["Father", "Survivors", "Baby"] },
    { timestamp: 240, content: "The father arrives at the survivors' camp. He is now fully transformed into a zombie.", entities: ["Father", "Survivors", "Infection"] },
    { timestamp: 260, content: "The survivors see the zombie approaching and prepare to defend themselves.", entities: ["Survivors", "Father"] },
    { timestamp: 280, content: "One survivor notices the baby on the zombie's back and the note attached to the carrier.", entities: ["Survivors", "Baby", "Note"] },
    { timestamp: 300, content: "The survivors read the note and understand the father's sacrifice. They realize he brought the baby to safety.", entities: ["Survivors", "Father", "Baby", "Note"] },
    { timestamp: 320, content: "The survivors carefully remove the baby from the zombie father's back, keeping the father at bay.", entities: ["Survivors", "Father", "Baby"] },
    { timestamp: 340, content: "The baby is safe. The survivors take the child, understanding the father's final act of love.", entities: ["Survivors", "Baby", "Father"] },
    { timestamp: 360, content: "The survivors bury the zombie father, honoring his sacrifice and the love that drove him to save his child.", entities: ["Survivors", "Father", "Baby"] },
    { timestamp: 380, content: "The baby is now in the care of the survivors, safe because of the father's selfless journey.", entities: ["Baby", "Survivors", "Father"] },
    { timestamp: 420, content: "The story ends with the baby safe, a testament to a father's love that transcended even death.", entities: ["Baby", "Father", "Survivors"] }
  ]
}

export async function handleTranscribe(request, env, corsHeaders) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio')

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: 'No audio file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Convert audio to text using Web Speech API (handled on frontend)
    // This endpoint could be used for server-side transcription if needed
    // For now, we'll return a placeholder since frontend handles transcription
    
    return new Response(
      JSON.stringify({ 
        text: 'Transcription handled on frontend',
        note: 'Use Web Speech API on client side'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

export async function handleQuery(request, env, corsHeaders) {
  try {
    const { question, timestamp, movieId, userId = 'default' } = await request.json()

    if (!question || timestamp === undefined || !movieId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: question, timestamp, movieId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get script for this movie
    const script = SCRIPTS[movieId]
    if (!script) {
      return new Response(
        JSON.stringify({ error: 'Movie not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Filter script up to current timestamp
    const scriptUpToTimestamp = script.filter(entry => entry.timestamp <= timestamp)

    // Build context prompt
    const scriptText = scriptUpToTimestamp
      .map(entry => `[${formatTime(entry.timestamp)}] ${entry.content}`)
      .join('\n')

    const prompt = `You are an AI assistant helping a viewer understand a movie. The viewer paused the movie at ${formatTime(timestamp)}.

Here is the script up to this exact moment:

${scriptText}

The viewer asked: "${question}"

IMPORTANT RULES:
1. Answer ONLY based on what has happened up to ${formatTime(timestamp)}. DO NOT spoil anything that happens after this point.
2. If the answer involves something that happened earlier in the movie, provide the timestamp (in seconds) when it occurred.
3. If the question is about something that hasn't been revealed yet, tell them to keep watching.
4. Be concise and helpful.
5. If you reference a specific moment, format it as: "This was mentioned at [timestamp in seconds] seconds."

Your response:`

    // Call Llama 3.3
    const aiResponse = await env.AI.run(
      '@cf/meta/llama-3.3-70b-instruct',
      {
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }
    )

    // Handle different response formats
    let answer = 'I apologize, but I could not generate a response.'
    if (typeof aiResponse === 'string') {
      answer = aiResponse
    } else if (aiResponse.response) {
      answer = aiResponse.response
    } else if (aiResponse.description) {
      answer = aiResponse.description
    } else if (aiResponse.text) {
      answer = aiResponse.text
    } else if (aiResponse.choices && aiResponse.choices[0] && aiResponse.choices[0].message) {
      answer = aiResponse.choices[0].message.content
    }

    // Extract timestamp from answer if present
    const timestampMatch = answer.match(/\[(\d+)\s*seconds?\]/i) || answer.match(/at\s+(\d+)\s*seconds?/i)
    const extractedTimestamp = timestampMatch ? parseInt(timestampMatch[1]) : null

    // Save to memory
    try {
      const id = env.MEMORY.idFromName(`${userId}:${movieId}`)
      const stub = env.MEMORY.get(id)
      await stub.fetch('http://memory/api', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          movieId,
          question,
          answer,
          timestamp: extractedTimestamp,
          currentTime: timestamp
        })
      })
    } catch (error) {
      console.error('Error saving to memory:', error)
      // Continue even if memory save fails
    }

    return new Response(
      JSON.stringify({
        answer,
        timestamp: extractedTimestamp
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleQuery:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

export async function handleMemory(request, env, corsHeaders) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId') || 'default'
    const movieId = url.searchParams.get('movieId') || 'default'

    const id = env.MEMORY.idFromName(`${userId}:${movieId}`)
    const stub = env.MEMORY.get(id)

    if (request.method === 'GET') {
      const response = await stub.fetch(`http://memory/api?userId=${userId}&movieId=${movieId}`)
      const memory = await response.json()
      return new Response(
        JSON.stringify(memory),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (request.method === 'POST') {
      const data = await request.json()
      const response = await stub.fetch('http://memory/api', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      const result = await response.json()
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
