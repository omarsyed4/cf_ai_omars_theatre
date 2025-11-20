# Development Prompts

This document contains the key prompts used during the development of Omar's Theater. These prompts represent the main requests and features that shaped the project from initial concept to final implementation.

---

## 1. Initial Project Setup & Structure

**Prompt:**
> "Alright, I want to make one main branch with the boilerplate stuff. It should literally just have the @index.html,gitignore @package-lock.json , and that's it. Then I want to make a branch off of that for the front-end stuff and another branch for the back-end stuff where we're uploading both. I want to simply make it look like I took this step-by-step in the repository, like there should be a great history of things that I've committed, and it should be easy to look at. I don't want to just upload everything right off the bat. I want to be able to look back and see what was committed one by one, and I want to see it in like baby steps."

**Result:** Established clean Git workflow with separate frontend and backend branches, detailed commit history for easy review.

---

## 2. iOS-Themed UI Design

**Prompt:**
> "Let's improve the frontend UI to be more 'iOS themed,' with rounded elements, smooth borders, and nice-looking icons."

**Result:** Implemented iOS-style design system with custom Tailwind utilities:
- Rounded corners (`ios`, `ios-lg`, `ios-xl`)
- Custom shadows (`ios`, `ios-lg`, `ios-xl`)
- Smooth transitions and hover effects
- Modern, polished interface

---

## 3. Custom Video Player with Full Controls

**Prompt:**
> "Let's make some key changes to the UI for the movie player. Right now, it doesn't look that great. It's just the standard JavaScript player, and when you go to play a movie, it basically just has everything standard. I would like it to be more like a modal on the side rather than just another window, and it would just look a lot better. Everything should be an icon, so the full screen actually shouldn't even be an option, so let's take that out. And we should also have the option to go back to. Let's make the volume slider for the movie look better too. Everything in the UI needs to look better for the movie player. Even the progress bar should look better. It should fill up with a gradient color instead, and it should be easy to move forward and backwards."

**Result:** Created `CustomVideoPlayer.vue` component with:
- Custom controls (no browser default)
- Gradient progress bar (Cloudflare orange)
- Draggable progress bar thumb
- Improved volume slider
- Back button
- Click anywhere to play/pause
- Auto-hiding controls (3-second timeout)

---

## 4. AI Chat Panel as Floating Side Modal

**Prompt:**
> "I would like it to be more like a modal on the side rather than just another window... When I try to pause the movie and ask the AI, it opens up a modal which actually looks really cool. But I don't want the movie to fade out or anything like that. I like the pop-up effect. I like everything. I just want the movie to still stay in frame. I want the movie to still be visible. I just want the AI chatbot on the side, and I want that to look floating on the side. I don't want anything else to be blurred out or anything like that."

**Result:** 
- AI panel as floating side panel (450px width)
- Video resizes and shifts left when AI panel opens
- Smooth slide-in animation
- No blur or fade effects on video
- Both components visible simultaneously

---

## 5. Keyboard Controls & Spacebar Logic

**Prompt:**
> "After the AI responds, we should make it so if the user has another question or follow-up question, then they can click the return or enter button to ask their next question so it'll just start the mic up again. If not, like to just escape, then they should just click the space bar button again so it just goes back to playing. That way it minimizes the AI window. Also, there is a bug if the movie is already paused and I click the spacebar, then it will still open the AI even though the movie just started back up again which doesn't make any sense. So, if it's already paused and the user clicks this spacebar, just play them if we don't open the AI or anything. The same thing for the adverse as well. If it's playing and should never be playing and show the AI at the same time, that should never happen."

**Result:**
- Spacebar: Playing → pause and open AI; Paused + AI open → close AI and resume; Paused + AI closed → just play
- Enter key: Start mic for follow-up questions
- Escape key: Close AI panel
- Global Enter key handler (works outside input field)
- Proper state management to prevent conflicts

---

## 6. Chat History Persistence

**Prompt:**
> "It should also remember what I'm asking. In the meantime, if there were any previous questions, then it should show those previous questions in the meantime as well. It doesn't make sense to just discard those every single time the user goes and plays another or goes back to play the movie and then comes back in. It's not fair to the user."

**Result:**
- Chat history stored in `sessionStorage` (per-session only)
- History persists within the same browser session
- Clears when tab closes (prevents old conversations from days ago)
- Per-movie conversation isolation

---

## 7. Cloudflare Orange Theme

**Prompt:**
> "There are a few things that need to change in terms of color: The accent color isn't changed in a few places. The AI chatbot isn't orange. The messages I'm sending are still blue. The buttons are still blue. They need to be orange. The gradient for the movie player (like the progress slider) actually changed which is really good, so let's keep that. The available film section if I hover over one movie, the movie title turns blue instead of orange, so let's change that as well. The play now button for each movie should be a gradient of orange as well. Everything should be playing off that Cloudflare theme, so let's fix that."

**Result:**
- Updated all accent colors to Cloudflare orange (`#F4811F`)
- User message bubbles: Orange gradient
- Buttons: Orange gradient
- Movie title hover: Orange
- Play buttons: Orange gradient
- Progress bar: Orange gradient
- Consistent Cloudflare branding throughout

---

## 8. Video Player Click-to-Play & Auto-Hide Controls

**Prompt:**
> "If I click anywhere on the screen in the video player, it doesn't pause and play. It's only when I click the play button or the pause button in the middle, and that's it. I also don't like the positioning of that. I don't want it to be in the middle at all. I want it to just be in the corner. But anywhere I click, it should pause and play. That's just the way things are. That's the way it is on Netflix and YouTube everywhere that plays video. So let's just stick to the norm. My mouse if it's on screen, the video player's overlay (the bottom panel and everything) don't go away after a fixed amount of time. It just stays there until my mouse goes on to another monitor or screen. Then it'll just show that overlay consistently. It will never go away, which is a problem as well, so you need to fix that too."

**Result:**
- Click anywhere on video to play/pause
- Play/pause button moved to bottom-left corner
- Controls auto-hide after 3 seconds when playing
- Controls show on mouse movement
- Controls stay visible when paused

---

## 9. AI Button in Video Player

**Prompt:**
> "I realized that the only way to get the chatbot into the frame is if I click the spacebar. There should be an AI button as well within the movie player. So change the @CustomVideoPlayer.vue file to have a button there for that purpose."

**Result:**
- Added AI button (SparklesIcon) in top-right of video player
- Orange gradient styling to match theme
- Pauses video and opens AI panel when clicked
- Provides alternative to spacebar for opening AI

---

## 10. Thumbnail Display & Movie Rotation

**Prompt:**
> "All right, let's use these thumbnails instead. Put them in the proper places, and make sure everything looks right when we go and use the arrows in the dashboard to switch through the movies. It's like a quick cut, I want it to fade instead. I want the text to fade in. I want it to basically look like I'm sliding over. What I'm saying? I want a mix of the two animations. I want things to look more human, more swift, more smooth. Show the thumbnails properly."

**Result:**
- Thumbnails properly displayed with `encodeURI()` for spaces in filenames
- Smooth fade/slide transitions for movie rotation
- Text and images fade in/out smoothly
- Centered movie grid (3 columns)
- Removed "More Info" and "Browse" buttons

---

## 11. Auto-Play & Video Reload on Route Change

**Prompt:**
> "When we go to play the movie, it's not fetching the right movie. I'm not sure why it's actually not fetching anything properly at all. When I go to play the movie, it doesn't automatically play. It just shows me the movie player and a play button, and then I have to manually click it and that's when it plays."

**Result:**
- Added `autoplay` attribute to video element
- Implemented `watch` handler for `videoUrl` prop to reload video when URL changes
- Video auto-plays when navigating to watch page
- Proper video reload on movie change

---

## 12. Speech Recognition & Mic Auto-Start

**Prompt:**
> "The mic was not automatically starting when the AI panel opened, despite previous fixes... After the user asks a question and the response is given by the AI, it immediately starts the speech recognition mic again, which shouldn't happen. It should only start back up when the user clicks the return or enter button to ask the follow-up question."

**Result:**
- Mic auto-starts when AI panel opens (first time)
- Mic does NOT auto-start after AI responds
- Mic only starts when user presses Enter/Return
- Fixed `InvalidStateError` by ensuring proper stop/start sequence
- Added delays to prevent race conditions
- Global Enter key handler for starting mic outside input field

---

## Summary

These prompts guided the development from a basic concept to a polished, production-ready application with:

- **Modern UI/UX:** iOS-themed design with smooth animations
- **Custom Video Player:** Full control over playback experience
- **Intelligent AI Integration:** Spoiler-free responses with conversation memory
- **Seamless User Experience:** Keyboard controls, auto-play, smooth transitions
- **Cloudflare Branding:** Consistent orange theme throughout
- **Robust Functionality:** Error handling, session management, proper state management

Each prompt addressed specific user experience issues and feature requirements, resulting in a cohesive and polished final product.

---

**Note:** These prompts represent the main development milestones. Many smaller refinements and bug fixes were made throughout the development process to achieve the final result.
