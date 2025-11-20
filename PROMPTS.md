# Development Prompts

This document contains the key prompts used during the development of Omar's Theater. These prompts represent the main requests that shaped the project from initial concept to final implementation.

---

## 1. Initial Project Setup

Build "Omars Theater," a mini Netflix-style streaming platform with dynamic UI and AI-assisted "pause-and-explain" capability. The platform should allow users to pause a film, ask questions, and receive spoiler-free explanations from an AI, with the ability to jump to relevant timestamps. The conversation memory should persist using Cloudflare Durable Objects. The project must satisfy all Cloudflare requirements, including using Llama 3.3 on Workers AI, Cloudflare Workers for the backend, Durable Objects for state and memory, and Cloudflare Pages with Vue.js for the UI.

---

## Frontend Prompts

### 2. Git Workflow & Repository Structure

Alright, I want to make one main branch with the boilerplate stuff. It should literally just have the @index.html,gitignore @package-lock.json , and that's it. Then I want to make a branch off of that for the front-end stuff and another branch for the back-end stuff where we're uploading both. I want to simply make it look like I took this step-by-step in the repository, like there should be a great history of things that I've committed, and it should be easy to look at. I don't want to just upload everything right off the bat. I want to be able to look back and see what was committed one by one, and I want to see it in like baby steps.

### 3. iOS-Themed UI Design

Let's improve the frontend UI to be more "iOS themed," with rounded elements, smooth borders, and nice-looking icons.

### 4. Custom Video Player Implementation

Let's make some key changes to the UI for the movie player. Right now, it doesn't look that great. It's just the standard JavaScript player, and when you go to play a movie, it basically just has everything standard. I would like it to be more like a modal on the side rather than just another window, and it would just look a lot better. Everything should be an icon, so the full screen actually shouldn't even be an option, so let's take that out. And we should also have the option to go back to. Let's make the volume slider for the movie look better too. Everything in the UI needs to look better for the movie player. Even the progress bar should look better. It should fill up with a gradient color instead, and it should be easy to move forward and backwards.


---

## Backend Prompts

### 5. Backend Setup & Cloudflare Deployment

Let's deploy the backend worker, and from there we can start testing the API endpoints and everything. Then the next step is just to get the AI working from Cloudflare, so let's do that first.

### 6. R2 Storage & Asset Management

The videos and their scripts are stored in the S3 storage bucket in the R2 Cloudflare, so we don't have to worry about that or worry about committing it here. Pull everything properly from the R2 bucket.

### 7. Durable Objects & Memory Persistence

The conversation memory should persist using Cloudflare Durable Objects. Implement per-user session memory that stores conversation history and allows the AI to remember previous questions and provide context-aware responses.

---

**Note:** These prompts represent the main development milestones that shaped Omar's Theater from concept to completion.
