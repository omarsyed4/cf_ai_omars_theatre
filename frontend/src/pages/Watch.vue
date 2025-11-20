<template>
  <div class="min-h-screen bg-black relative">
    <!-- Video Container -->
    <div 
      class="transition-all duration-500 ease-in-out"
      :class="isPaused ? 'w-[40%]' : 'w-full'">
      <video
        ref="videoPlayer"
        :src="movie.videoUrl"
        class="w-full h-screen object-contain"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onVideoLoaded"
        controls
        autoplay>
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Chat Panel -->
    <div
      v-if="isPaused"
      class="fixed top-0 right-0 w-[60%] h-screen bg-theater-dark transition-transform duration-500 ease-in-out overflow-hidden shadow-ios-xl border-l border-white/10"
      :class="isPaused ? 'translate-x-0' : 'translate-x-full'">
      <ChatPanel
        :current-time="currentTime"
        :paused-at="pausedAt"
        :movie-id="movieId"
        @close="resumePlayback"
        @jump-to="jumpToTimestamp"
        @return-to-present="returnToPresent" />
    </div>

    <!-- Tutorial Modal -->
    <TutorialModal
      v-if="showTutorial"
      @close="closeTutorial" />
  </div>
</template>

<script>
import ChatPanel from '../components/ChatPanel.vue'
import TutorialModal from '../components/TutorialModal.vue'
import { movies } from '../data/movies.js'

export default {
  name: 'Watch',
  components: {
    ChatPanel,
    TutorialModal
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isPaused: false,
      currentTime: 0,
      pausedAt: 0, // Track where user paused to enable "return to present"
      showTutorial: false
    }
  },
  computed: {
    movieId() {
      return this.id
    },
    movie() {
      return movies.find(m => m.id === this.id) || movies[0]
    }
  },
  mounted() {
    // Check if tutorial was shown before
    const tutorialShown = localStorage.getItem('tutorialShown')
    if (!tutorialShown) {
      this.showTutorial = true
    }

    // Listen for spacebar
    window.addEventListener('keydown', this.handleKeyPress)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
    handleKeyPress(e) {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        this.togglePause()
      }
    },
    togglePause() {
      if (!this.$refs.videoPlayer) return

      if (this.isPaused) {
        this.resumePlayback()
      } else {
        this.pausePlayback()
      }
    },
    pausePlayback() {
      if (this.$refs.videoPlayer) {
        this.pausedAt = Math.floor(this.$refs.videoPlayer.currentTime)
        this.$refs.videoPlayer.pause()
        this.isPaused = true
      }
    },
    resumePlayback() {
      this.isPaused = false
      this.$refs.videoPlayer.play()
    },
    onTimeUpdate() {
      if (this.$refs.videoPlayer) {
        this.currentTime = Math.floor(this.$refs.videoPlayer.currentTime)
      }
    },
    onVideoLoaded() {
      // Video metadata loaded
    },
    jumpToTimestamp(timestamp) {
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.currentTime = timestamp
        // Don't resume automatically - let user watch from this point
      }
    },
    returnToPresent() {
      if (this.$refs.videoPlayer && this.pausedAt > 0) {
        this.$refs.videoPlayer.currentTime = this.pausedAt
      }
    },
    closeTutorial() {
      this.showTutorial = false
      localStorage.setItem('tutorialShown', 'true')
    }
  }
}
</script>

