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

### 5. AI Chat Panel as Floating Side Modal

I would like it to be more like a modal on the side rather than just another window... When I try to pause the movie and ask the AI, it opens up a modal which actually looks really cool. But I don't want the movie to fade out or anything like that. I like the pop-up effect. I like everything. I just want the movie to still stay in frame. I want the movie to still be visible. I just want the AI chatbot on the side, and I want that to look floating on the side. I don't want anything else to be blurred out or anything like that.

### 6. Keyboard Controls & Spacebar Logic

After the AI responds, we should make it so if the user has another question or follow-up question, then they can click the return or enter button to ask their next question so it'll just start the mic up again. If not, like to just escape, then they should just click the space bar button again so it just goes back to playing. That way it minimizes the AI window. Also, there is a bug if the movie is already paused and I click the spacebar, then it will still open the AI even though the movie just started back up again which doesn't make any sense. So, if it's already paused and the user clicks this spacebar, just play them if we don't open the AI or anything. The same thing for the adverse as well. If it's playing and should never be playing and show the AI at the same time, that should never happen.

### 7. Cloudflare Orange Theme

There are a few things that need to change in terms of color: The accent color isn't changed in a few places. The AI chatbot isn't orange. The messages I'm sending are still blue. The buttons are still blue. They need to be orange. The gradient for the movie player (like the progress slider) actually changed which is really good, so let's keep that. The available film section if I hover over one movie, the movie title turns blue instead of orange, so let's change that as well. The play now button for each movie should be a gradient of orange as well. Everything should be playing off that Cloudflare theme, so let's fix that.

### 8. Video Player Click-to-Play & Auto-Hide Controls

If I click anywhere on the screen in the video player, it doesn't pause and play. It's only when I click the play button or the pause button in the middle, and that's it. I also don't like the positioning of that. I don't want it to be in the middle at all. I want it to just be in the corner. But anywhere I click, it should pause and play. That's just the way things are. That's the way it is on Netflix and YouTube everywhere that plays video. So let's just stick to the norm. My mouse if it's on screen, the video player's overlay (the bottom panel and everything) don't go away after a fixed amount of time. It just stays there until my mouse goes on to another monitor or screen. Then it'll just show that overlay consistently. It will never go away, which is a problem as well, so you need to fix that too.

### 9. AI Button in Video Player

I realized that the only way to get the chatbot into the frame is if I click the spacebar. There should be an AI button as well within the movie player. So change the @CustomVideoPlayer.vue file to have a button there for that purpose.

### 10. Chat History & Speech Recognition

It should also remember what I'm asking. In the meantime, if there were any previous questions, then it should show those previous questions in the meantime as well. It doesn't make sense to just discard those every single time the user goes and plays another or goes back to play the movie and then comes back in. It's not fair to the user. Also, after the user asks a question and the response is given by the AI, it immediately starts the speech recognition mic again, which shouldn't happen. It should only start back up when the user clicks the return or enter button to ask the follow-up question.

---

## Backend Prompts

### 11. Backend Setup & Cloudflare Deployment

Let's deploy the backend worker, and from there we can start testing the API endpoints and everything. Then the next step is just to get the AI working from Cloudflare, so let's do that first.

### 12. R2 Storage & Asset Management

Here's the URL: https://pub-04a0de5f81b649f9abb5465eb19addbd.r2.dev Also, get rid of the thumbnails, we don't need that right now. We'll worry about it later. Just put placeholders in there for now. The videos and their scripts are stored in the S3 storage bucket in the R2 Cloudflare, so we don't have to worry about that or worry about committing it here. Instead, let's just get rid of those folders and files. Why waste unnecessary memory here?

### 13. Durable Objects & Memory Persistence

The conversation memory should persist using Cloudflare Durable Objects. Implement per-user session memory that stores conversation history and allows the AI to remember previous questions and provide context-aware responses.

---

**Note:** These prompts represent the main development milestones that shaped Omar's Theater from concept to completion.
