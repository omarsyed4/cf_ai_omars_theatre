# Technical Documentation

Complete technical documentation for Omar's Theater - an AI-powered movie streaming platform built on Cloudflare's edge computing infrastructure.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [API Documentation](#api-documentation)
- [Data Flow](#data-flow)
- [Cloudflare Services](#cloudflare-services)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Configuration](#configuration)

---

## 🏗️ Architecture Overview

Omar's Theater is built as a full-stack application leveraging Cloudflare's edge computing platform:

```
┌─────────────────────────────────────────────────────────────┐
│                     Cloudflare Pages                         │
│              (Frontend - Vue.js Application)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Home.vue   │  │  Watch.vue   │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Cloudflare Workers                          │
│              (Backend API - Serverless)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  worker.js (Router)                                  │   │
│  │  ├── /api/query → aiHandlers.js                      │   │
│  │  └── /api/memory → durableObject.js                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Workers AI (Llama 3.1 70B Instruct)                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Durable Objects (MemoryDO)                          │   │
│  │  - Per-user conversation memory                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Asset Requests
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Cloudflare R2 Storage                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Videos     │  │   Scripts    │  │  Thumbnails  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend build tool
- **TailwindCSS** - Utility-first CSS framework
- **Vue Router** - Client-side routing
- **Heroicons** - Icon library
- **Web Speech API** - Browser-based speech recognition

### Backend
- **Cloudflare Workers** - Serverless edge computing
- **Workers AI** - On-edge AI inference
- **Durable Objects** - Stateful edge storage
- **Cloudflare R2** - Object storage (S3-compatible)

### AI/ML
- **Llama 3.1 70B Instruct** - Large language model via Workers AI
- **Prompt Engineering** - Custom prompts for spoiler-free responses

---

## 📁 Project Structure

```
omars-theater/
├── backend/
│   ├── worker.js              # Main Worker entry point
│   ├── aiHandlers.js          # AI query and transcription handlers
│   ├── durableObject.js       # Durable Object for memory storage
│   ├── wrangler.toml          # Cloudflare Workers configuration
│   └── package.json           # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.vue       # Landing page with movie grid
│   │   │   └── Watch.vue      # Video player page
│   │   ├── components/
│   │   │   ├── ChatPanel.vue          # AI chat interface
│   │   │   ├── CustomVideoPlayer.vue  # Custom video controls
│   │   │   ├── MovieCard.vue          # Movie card component
│   │   │   ├── MovieGrid.vue          # Movie grid layout
│   │   │   └── TutorialModal.vue      # First-time user guide
│   │   ├── data/
│   │   │   └── movies.js      # Movie metadata
│   │   ├── router.js          # Vue Router configuration
│   │   ├── App.vue            # Root component
│   │   └── main.js            # Application entry point
│   ├── public/
│   │   ├── thumbnails/        # Movie thumbnail images
│   │   └── cloudflare-logo.svg
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # TailwindCSS configuration
│   └── package.json           # Frontend dependencies
│
└── package.json               # Root package.json for dev scripts
```

---

## 🔧 Backend Architecture

### Cloudflare Worker (`worker.js`)

The main entry point for all backend requests. Handles routing and CORS.

**Key Responsibilities:**
- Route incoming requests to appropriate handlers
- Manage CORS headers for cross-origin requests
- Export Durable Object class for binding

**Routes:**
- `POST /api/query` - AI query endpoint
- `GET/POST /api/memory` - Memory storage endpoint
- `OPTIONS /*` - CORS preflight handling

### AI Handlers (`aiHandlers.js`)

Processes AI queries with spoiler-free logic.

**`handleQuery(request, env, corsHeaders)`**

1. Validates request payload (question, timestamp, movieId)
2. Loads movie script from R2 bucket
3. Filters script content up to paused timestamp
4. Retrieves conversation history from Durable Object
5. Constructs AI prompt with context and rules
6. Calls Workers AI (Llama 3.1 70B Instruct)
7. Saves conversation to Durable Object
8. Returns response with answer and optional timestamp

**Key Features:**
- Timestamp-based script filtering (prevents spoilers)
- Conversation history integration
- Timestamp extraction from AI responses
- Error handling and logging

### Durable Object (`durableObject.js`)

Persistent storage for per-user conversation memory.

**Class: `MemoryDO`**

**Storage Structure:**
```javascript
{
  questions: [
    { question: string, timestamp: number, askedAt: number }
  ],
  responses: [
    { answer: string, timestamp: number | null, respondedAt: number }
  ],
  progress: number  // Maximum timestamp reached
}
```

**Methods:**
- `GET /api/memory?userId=X&movieId=Y` - Retrieve memory
- `POST /api/memory` - Save conversation entry

**Key Features:**
- Per-user, per-movie isolation
- Persistent across requests
- Automatic key generation: `memory:${userId}:${movieId}`

---

## 🎨 Frontend Architecture

### Routing (`router.js`)

Vue Router configuration with two main routes:
- `/` - Home page (movie selection)
- `/watch/:id` - Video player page

### Pages

#### Home.vue
- Displays hero banner with featured movie
- Movie grid with rotation animations
- Navigation header with Cloudflare branding
- Footer with assignment information

**Key Features:**
- Smooth fade/slide transitions between movies
- Responsive grid layout (3 columns on desktop)
- Movie card hover effects

#### Watch.vue
- Full-screen video player
- AI chat panel (floating side panel)
- Keyboard controls (Spacebar, Escape, Enter)
- Tutorial modal for first-time users

**State Management:**
- `showAIPanel` - Controls AI panel visibility
- `currentTime` - Current video playback time
- `pausedAt` - Timestamp when video was paused
- `isVideoPlaying` - Playback state

**Key Features:**
- Video resizes and shifts left when AI panel opens
- Smooth slide-in animation for AI panel
- Auto-play on route change
- Session-based chat history

### Components

#### CustomVideoPlayer.vue
Custom video player with full control over UI and behavior.

**Features:**
- Click anywhere to play/pause
- Custom progress bar with draggable thumb
- Volume control with slider
- Auto-hiding controls (3-second timeout)
- Back button and AI button in top bar
- Gradient progress bar (Cloudflare orange)

**Methods:**
- `play()` - Start playback
- `pause()` - Pause playback
- `getCurrentTime()` - Get current timestamp
- `setCurrentTime(time)` - Seek to timestamp

#### ChatPanel.vue
AI chat interface with voice and text input.

**Features:**
- Web Speech API integration for voice input
- Auto-start recording when panel opens
- Session-based chat history (sessionStorage)
- Global Enter key handler for follow-up questions
- Timestamp links in AI responses
- "Return to Present" button
- Loading states and error handling

**State Management:**
- `messages` - Array of conversation messages
- `isRecording` - Speech recognition state
- `isLoading` - AI response loading state
- `textInput` - Text input value

**Key Methods:**
- `startRecording()` - Begin speech recognition
- `stopRecording()` - Stop speech recognition
- `sendMessage()` - Send question to AI
- `loadChatHistory()` - Load from sessionStorage
- `saveChatHistory()` - Save to sessionStorage

---

## 📡 API Documentation

### POST /api/query

Submit a question about the movie at a specific timestamp.

**Request:**
```json
{
  "question": "Who is that character?",
  "timestamp": 45,
  "movieId": "black-hole"
}
```

**Response:**
```json
{
  "answer": "That character is...",
  "timestamp": 12  // Optional: referenced timestamp
}
```

**Error Responses:**
- `400` - Missing required fields
- `404` - Movie not found
- `500` - Server error

### GET /api/memory

Retrieve conversation history for a user and movie.

**Query Parameters:**
- `userId` (optional) - User identifier
- `movieId` (required) - Movie identifier

**Response:**
```json
{
  "questions": [...],
  "responses": [...],
  "progress": 120
}
```

### POST /api/memory

Save a conversation entry.

**Request:**
```json
{
  "userId": "user123",
  "movieId": "black-hole",
  "question": "Who is that?",
  "answer": "That is...",
  "timestamp": 12,
  "currentTime": 45
}
```

**Response:**
```json
{
  "success": true
}
```

---

## 🔄 Data Flow

### User Question Flow

```
1. User pauses video (Spacebar or AI button)
   ↓
2. Watch.vue captures pausedAt timestamp
   ↓
3. ChatPanel.vue opens, starts recording
   ↓
4. User speaks or types question
   ↓
5. ChatPanel sends POST /api/query
   {
     question: "Who is that?",
     timestamp: 45,
     movieId: "black-hole"
   }
   ↓
6. Worker loads script from R2
   ↓
7. Script filtered to entries <= 45 seconds
   ↓
8. Conversation history loaded from Durable Object
   ↓
9. Prompt constructed with context
   ↓
10. Workers AI (Llama 3.1) generates response
    ↓
11. Response saved to Durable Object
    ↓
12. Response returned to frontend
    ↓
13. ChatPanel displays answer with timestamp links
```

### Memory Persistence Flow

```
1. Conversation entry created
   ↓
2. Durable Object ID generated: idFromName(`${userId}:${movieId}`)
   ↓
3. Entry saved to Durable Object storage
   ↓
4. Stored per-user, per-movie
   ↓
5. Retrieved on subsequent questions for context
```

---

## ☁️ Cloudflare Services

### Cloudflare Workers

**Configuration (`wrangler.toml`):**
```toml
name = "omars-theater-backend"
main = "worker.js"
compatibility_date = "2024-12-01"

[ai]
binding = "AI"

[[r2_buckets]]
binding = "FILMS"
bucket_name = "omars-theater-films"

[[durable_objects.bindings]]
name = "MEMORY"
class_name = "MemoryDO"
script_name = "omars-theater-backend"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["MemoryDO"]
```

**Key Bindings:**
- `AI` - Workers AI binding for Llama 3.1
- `FILMS` - R2 bucket for video/script assets
- `MEMORY` - Durable Object namespace

### Workers AI

**Model:** `@cf/meta/llama-3.1-70b-instruct`

**Usage:**
```javascript
const aiResponse = await env.AI.run(
  '@cf/meta/llama-3.1-70b-instruct',
  {
    messages: [
      { role: 'user', content: prompt }
    ]
  }
)
```

### Durable Objects

**Migration:** Uses `new_sqlite_classes` for free-tier compatibility.

**Isolation:** Each user-movie combination gets a unique Durable Object instance.

**Persistence:** Data persists across requests and deployments.

### Cloudflare R2

**Bucket:** `omars-theater-films`

**Structure:**
```
omars-theater-films/
├── black-hole/
│   ├── video.mp4
│   └── script.json
├── alma/
│   ├── video.mp4
│   └── script.json
└── cargo/
    ├── video.mp4
    └── script.json
```

**Public URL:** `https://pub-04a0de5f81b649f9abb5465eb19addbd.r2.dev`

### Cloudflare Pages

**Build Command:** `npm run build`
**Output Directory:** `dist`
**Framework Preset:** Vue

---

## 💻 Local Development

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account
- Wrangler CLI (installed via npm)

### Setup

1. **Install dependencies:**
```bash
npm run install:all
```

2. **Configure Cloudflare:**
```bash
cd backend
npx wrangler login
```

3. **Start development servers:**
```bash
# From root directory
npm run dev
```

This starts:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8787`

### Development Scripts

**Root:**
- `npm run dev` - Run both frontend and backend
- `npm run install:all` - Install all dependencies

**Frontend:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production

**Backend:**
- `npm run dev` - Start Wrangler dev server
- `npm run deploy` - Deploy to Cloudflare Workers

---

## 🚀 Deployment

### Frontend (Cloudflare Pages)

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Deploy to Cloudflare Pages:**
   - Via Dashboard: Upload `dist/` folder
   - Via Wrangler: `npx wrangler pages deploy dist`
   - Via Git: Connect repository for automatic deployments

3. **Configure environment:**
   - Set production API URL in environment variables
   - Update `vite.config.js` proxy settings if needed

### Backend (Cloudflare Workers)

1. **Deploy worker:**
```bash
cd backend
npm run deploy
```

2. **Verify deployment:**
```bash
npx wrangler tail
```

### R2 Assets

1. **Upload videos:**
```bash
npx wrangler r2 object put FILMS/black-hole/video.mp4 --file=./video.mp4 --remote
```

2. **Upload scripts:**
```bash
npx wrangler r2 object put FILMS/black-hole/script.json --file=./script.json --remote
```

3. **Configure public access:**
   - Set R2 bucket to public
   - Configure custom domain or use public URL

---

## ⚙️ Configuration

### Frontend Configuration

**`vite.config.js`:**
```javascript
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    }
  }
})
```

**`tailwind.config.js`:**
- Custom colors: `theater-primary` (#F4811F), `theater-secondary` (#FAAD3F)
- Custom border radius: `ios`, `ios-lg`, `ios-xl`
- Custom shadows: `ios`, `ios-lg`, `ios-xl`

### Backend Configuration

**`wrangler.toml`:**
- Worker name and compatibility date
- AI binding configuration
- R2 bucket bindings
- Durable Object bindings and migrations

### Environment Variables

**Production:**
- Update API endpoints in `frontend/src/data/movies.js`
- Configure R2 public URLs
- Set CORS origins in `worker.js`

---

## 🔐 Security Considerations

- **CORS:** Configured for development (`*`). Restrict in production.
- **User Identification:** Uses `CF-Connecting-IP` header for user IDs
- **Input Validation:** All API endpoints validate required fields
- **Error Handling:** Comprehensive error handling with user-friendly messages
- **Session Storage:** Chat history stored in `sessionStorage` (client-side only)

---

## 📊 Performance Optimizations

- **Edge Computing:** All processing happens at the edge (low latency)
- **R2 CDN:** Video assets served from Cloudflare's global network
- **Lazy Loading:** Vue components loaded on demand
- **Session Storage:** Chat history cleared on tab close (reduces memory)
- **Auto-hide Controls:** Video controls hidden after 3 seconds

---

## 🐛 Known Limitations

- **Speech Recognition:** Requires browser support (Chrome, Edge, Safari)
- **Model Availability:** Llama 3.1 70B may have rate limits
- **R2 Public Access:** Requires public bucket configuration
- **Durable Objects:** Free tier has usage limits

---

## 📝 License

MIT

---

**Built for Cloudflare Fast-Track AI Assignment • Omar Syed**

