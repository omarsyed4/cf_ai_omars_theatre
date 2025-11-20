<template>
  <div class="min-h-screen bg-black relative overflow-hidden">
    <!-- Video Container - Full Screen -->
    <div 
      class="absolute inset-0 transition-all duration-500 ease-in-out"
      :class="showAIPanel ? 'right-[450px]' : 'right-0'">
      <CustomVideoPlayer
        ref="videoPlayer"
        :video-url="movie.videoUrl"
        :movie-title="movie.title"
        @timeupdate="onTimeUpdate"
        @play="onVideoPlay"
        @pause="onVideoPause"
        @go-back="goBack"
        @open-ai="handleOpenAIFromPlayer" />
    </div>

    <!-- AI Panel Side Panel (Floating) -->
    <transition name="slide-in">
      <div
        v-if="showAIPanel"
        class="fixed top-0 right-0 h-screen w-[450px] z-50 flex items-center p-4 pointer-events-none">
        <div class="w-full h-[90vh] bg-gradient-to-br from-theater-dark via-theater-gray/50 to-theater-dark backdrop-blur-xl rounded-ios-xl border border-white/10 shadow-ios-xl pointer-events-auto overflow-hidden">
          <ChatPanel
            :current-time="currentTime"
            :paused-at="pausedAt"
            :movie-id="movieId"
            @close="closeAIPanel"
            @jump-to="jumpToTimestamp"
            @return-to-present="returnToPresent"
            @ask-follow-up="handleFollowUp" />
        </div>
      </div>
    </transition>

    <!-- Tutorial Modal -->
    <TutorialModal
      v-if="showTutorial"
      @close="closeTutorial" />
  </div>
</template>

<script>
import ChatPanel from '../components/ChatPanel.vue'
import TutorialModal from '../components/TutorialModal.vue'
import CustomVideoPlayer from '../components/CustomVideoPlayer.vue'
import { movies } from '../data/movies.js'

export default {
  name: 'Watch',
  components: {
    ChatPanel,
    TutorialModal,
    CustomVideoPlayer
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showAIPanel: false,
      currentTime: 0,
      pausedAt: 0,
      showTutorial: false,
      isVideoPlaying: false
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

    // Listen for spacebar and escape
    window.addEventListener('keydown', this.handleKeyPress)
    
    // Auto-play video when component mounts
    this.$nextTick(() => {
      if (this.$refs.videoPlayer) {
        setTimeout(() => {
          this.$refs.videoPlayer.play()
        }, 500)
      }
    })
  },
  watch: {
    // Watch for route changes to reload video
    id(newId) {
      this.$nextTick(() => {
        if (this.$refs.videoPlayer) {
          setTimeout(() => {
            this.$refs.videoPlayer.play()
          }, 500)
        }
      })
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
    handleKeyPress(e) {
      // Spacebar handling
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        
        // If video is playing, pause and open AI
        if (this.isVideoPlaying) {
          this.pauseAndOpenAI()
        }
        // If video is paused and AI is open, close AI and resume
        else if (!this.isVideoPlaying && this.showAIPanel) {
          this.closeAIPanel()
          this.resumePlayback()
        }
        // If video is paused and AI is closed, just play
        else if (!this.isVideoPlaying && !this.showAIPanel) {
          this.resumePlayback()
        }
      }
      
      // Escape key to close AI panel
      if (e.key === 'Escape' && this.showAIPanel) {
        this.closeAIPanel()
        if (!this.isVideoPlaying) {
          this.resumePlayback()
        }
      }
    },
    pauseAndOpenAI() {
      if (this.$refs.videoPlayer) {
        this.pausedAt = this.$refs.videoPlayer.getCurrentTime()
        this.$refs.videoPlayer.pause()
        this.isVideoPlaying = false
        this.showAIPanel = true
      }
    },
    handleOpenAIFromPlayer() {
      // Handle AI button click from video player
      if (this.$refs.videoPlayer) {
        this.pausedAt = this.$refs.videoPlayer.getCurrentTime()
        this.isVideoPlaying = false
        this.showAIPanel = true
      }
    },
    resumePlayback() {
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.play()
        this.isVideoPlaying = true
      }
    },
    closeAIPanel() {
      this.showAIPanel = false
    },
    onTimeUpdate(time) {
      this.currentTime = time
    },
    onVideoPlay() {
      this.isVideoPlaying = true
      // Ensure AI panel is closed when video plays
      if (this.showAIPanel) {
        this.showAIPanel = false
      }
    },
    onVideoPause() {
      this.isVideoPlaying = false
    },
    jumpToTimestamp(timestamp) {
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.setCurrentTime(timestamp)
        // Don't auto-play after jump
      }
    },
    returnToPresent() {
      if (this.$refs.videoPlayer && this.pausedAt > 0) {
        this.$refs.videoPlayer.setCurrentTime(this.pausedAt)
      }
    },
    handleFollowUp() {
      // This will be handled by ChatPanel - it will restart recording
    },
    goBack() {
      this.$router.push('/')
    },
    closeTutorial() {
      this.showTutorial = false
      localStorage.setItem('tutorialShown', 'true')
    }
  }
}
</script>

<style scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.slide-in-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-in-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
