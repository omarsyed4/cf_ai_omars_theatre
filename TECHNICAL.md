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
- [Cloudflare Services](#cloudflare-services)
- [Local Development](#local-development)
- [Deployment](#deployment)

---

## 🏗️ Architecture Overview

```
Frontend (Cloudflare Pages - Vue.js)
    ↓ HTTP Requests
Backend (Cloudflare Workers)
    ├── Workers AI (Llama 3.1 70B)
    ├── Durable Objects (Memory Storage)
    └── R2 Storage (Videos & Scripts)
```

**Key Components:**
- **Frontend:** Vue.js SPA hosted on Cloudflare Pages
- **Backend:** Serverless Workers API with AI inference
- **Storage:** R2 for assets, Durable Objects for conversation memory
- **AI:** Llama 3.1 70B via Workers AI for spoiler-free explanations

---

## 🛠️ Tech Stack

**Frontend:** Vue.js 3, Vite, TailwindCSS, Vue Router, Web Speech API  
**Backend:** Cloudflare Workers, Workers AI, Durable Objects, R2  
**AI Model:** Llama 3.1 70B Instruct

---

## 📁 Project Structure

```
omars-theater/
├── backend/
│   ├── worker.js          # Main Worker entry point
│   ├── aiHandlers.js      # AI query handlers
│   ├── durableObject.js   # Memory storage
│   └── wrangler.toml      # Cloudflare config
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # Home.vue, Watch.vue
│   │   ├── components/    # ChatPanel, CustomVideoPlayer, etc.
│   │   └── data/          # movies.js
│   └── public/            # Thumbnails, assets
│
└── package.json           # Root dev scripts
```

---

## 🔧 Backend Architecture

### Worker (`worker.js`)
Routes requests and handles CORS:
- `POST /api/query` → AI query handler
- `GET/POST /api/memory` → Memory storage

### AI Handler (`aiHandlers.js`)
**`handleQuery()` Flow:**
1. Validates request (question, timestamp, movieId)
2. Loads script from R2 bucket
3. Filters script up to paused timestamp (prevents spoilers)
4. Loads conversation history from Durable Object
5. Constructs prompt with context
6. Calls Workers AI (Llama 3.1 70B)
7. Saves conversation to Durable Object
8. Returns response

### Durable Object (`durableObject.js`)
**Class:** `MemoryDO`

Stores per-user, per-movie conversation history:
```javascript
{
  questions: [{ question, timestamp, askedAt }],
  responses: [{ answer, timestamp, respondedAt }],
  progress: number
}
```

**Key:** `memory:${userId}:${movieId}`

---

## 🎨 Frontend Architecture

### Pages

**Home.vue:**
- Hero banner with featured movie
- Movie grid (3 columns)
- Smooth fade/slide transitions

**Watch.vue:**
- Full-screen video player
- Floating AI chat panel (450px side panel)
- Keyboard controls (Spacebar, Escape, Enter)
- State: `showAIPanel`, `currentTime`, `pausedAt`, `isVideoPlaying`

### Components

**CustomVideoPlayer.vue:**
- Click anywhere to play/pause
- Custom progress bar (draggable, orange gradient)
- Volume control
- Auto-hiding controls (3s timeout)
- Back button & AI button in top bar

**ChatPanel.vue:**
- Web Speech API for voice input
- Text input fallback
- Session-based chat history (sessionStorage)
- Global Enter key handler
- Timestamp links in responses

---

## 📡 API Documentation

### POST /api/query

Submit a question about the movie.

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
  "timestamp": 12  // Optional referenced timestamp
}
```

### GET /api/memory

Retrieve conversation history.

**Query:** `?userId=X&movieId=Y`

**Response:**
```json
{
  "questions": [...],
  "responses": [...],
  "progress": 120
}
```

### POST /api/memory

Save conversation entry.

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

---

## ☁️ Cloudflare Services

### Workers Configuration (`wrangler.toml`)

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

### Workers AI
- **Model:** `@cf/meta/llama-3.1-70b-instruct`
- **Usage:** `env.AI.run('@cf/meta/llama-3.1-70b-instruct', { messages })`

### Durable Objects
- Per-user, per-movie isolation
- Persistent across requests
- Uses `new_sqlite_classes` for free-tier compatibility

### R2 Storage
- **Bucket:** `omars-theater-films`
- **Structure:** `{movie-id}/video.mp4` and `{movie-id}/script.json`
- **Public URL:** `https://pub-04a0de5f81b649f9abb5465eb19addbd.r2.dev`

### Cloudflare Pages
- **Build:** `npm run build`
- **Output:** `dist/`
- **Framework:** Vue

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI

### Setup

1. **Install dependencies:**
```bash
npm run install:all
```

2. **Login to Cloudflare:**
```bash
cd backend
npx wrangler login
```

3. **Start dev servers:**
```bash
npm run dev
```

Runs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8787`

### Scripts

**Root:**
- `npm run dev` - Run both servers
- `npm run install:all` - Install all deps

**Frontend:**
- `npm run dev` - Vite dev server
- `npm run build` - Production build

**Backend:**
- `npm run dev` - Wrangler dev
- `npm run deploy` - Deploy to Workers

---

## 🚀 Deployment

### Frontend (Cloudflare Pages)

```bash
cd frontend
npm run build
# Deploy dist/ via Dashboard, Wrangler, or Git integration
```

### Backend (Cloudflare Workers)

```bash
cd backend
npm run deploy
```

### R2 Assets

```bash
# Upload videos
npx wrangler r2 object put FILMS/black-hole/video.mp4 --file=./video.mp4 --remote

# Upload scripts
npx wrangler r2 object put FILMS/black-hole/script.json --file=./script.json --remote
```

**Note:** Configure R2 bucket for public access.

---

## ⚙️ Configuration

### Frontend (`vite.config.js`)
- Proxy `/api` to `http://localhost:8787` in dev
- Port: 5173

### Frontend (`tailwind.config.js`)
- Colors: `theater-primary` (#F4811F), `theater-secondary` (#FAAD3F)
- Border radius: `ios`, `ios-lg`, `ios-xl`
- Shadows: `ios`, `ios-lg`, `ios-xl`

### Backend (`wrangler.toml`)
- Worker name, compatibility date
- AI, R2, and Durable Object bindings
- Migration configuration

---

## 🔐 Security & Performance

**Security:**
- CORS configured (restrict in production)
- Input validation on all endpoints
- Session storage for chat history (client-side)

**Performance:**
- Edge computing (low latency)
- R2 CDN for video assets
- Auto-hide video controls
- Session storage clears on tab close

---

## 🐛 Known Limitations

- Speech Recognition requires browser support (Chrome, Edge, Safari)
- Llama 3.1 70B may have rate limits
- R2 requires public bucket configuration
- Durable Objects free tier has usage limits

---

**Built for Cloudflare Fast-Track AI Assignment • Omar Syed**
