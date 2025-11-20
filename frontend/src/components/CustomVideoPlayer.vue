<template>
  <div class="relative w-full h-screen bg-black overflow-hidden" @click="handleVideoClick">
    <!-- Video Element -->
    <video
      ref="videoElement"
      :src="videoUrl"
      class="w-full h-full object-contain"
      autoplay
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onVideoLoaded"
      @play="onPlay"
      @pause="onPause">
      Your browser does not support the video tag.
    </video>

    <!-- Custom Controls Overlay -->
    <div 
      class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 pointer-events-none"
      :class="showControls ? 'opacity-100' : 'opacity-0'"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @mousemove="onMouseMove">
      
      <!-- Top Bar with Back Button and Title -->
      <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-center pointer-events-auto">
        <button
          @click.stop="handleGoBack"
          class="w-10 h-10 rounded-ios-lg bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all duration-200 flex items-center justify-center active:scale-95 border border-white/20 z-10">
          <ArrowLeftIcon class="w-5 h-5 text-white" />
        </button>
        <div class="absolute left-1/2 -translate-x-1/2 text-white text-lg font-bold">
          {{ movieTitle }}
        </div>
        <div class="w-10"></div> <!-- Spacer -->
      </div>

      <!-- Bottom Controls -->
      <div 
        v-if="showControls || isPaused"
        class="absolute bottom-0 left-0 right-0 p-4 space-y-3 pointer-events-auto">
        
        <!-- Progress Bar -->
        <div class="relative group">
          <div 
            class="h-2 bg-white/20 rounded-full cursor-pointer relative"
            @click="seekTo"
            @mousedown="startDragging"
            ref="progressBar">
            <div 
              class="h-full rounded-full transition-all duration-200"
              :style="{ 
                width: `${progressPercent}%`,
                background: 'linear-gradient(to right, #F4811F, #FAAD3F)'
              }">
            </div>
            <div 
              class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
              :style="{ left: `calc(${progressPercent}% - 8px)` }">
            </div>
          </div>
        </div>

        <!-- Controls Row -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- Play/Pause -->
            <button
              @click="togglePlayPause"
              class="w-10 h-10 rounded-ios-lg bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center active:scale-95">
              <PlayIcon v-if="isPaused" class="w-5 h-5 text-white ml-0.5" />
              <PauseIcon v-else class="w-5 h-5 text-white" />
            </button>

            <!-- Volume Control -->
            <div class="flex items-center space-x-2">
              <button
                @click="toggleMute"
                class="w-10 h-10 rounded-ios-lg bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center active:scale-95">
                <SpeakerWaveIcon v-if="!isMuted && volume > 0.5" class="w-5 h-5 text-white" />
                <SpeakerXMarkIcon v-else-if="isMuted || volume === 0" class="w-5 h-5 text-white" />
                <SpeakerWaveIcon v-else class="w-5 h-5 text-white" />
              </button>
              <div class="relative w-24 group/volume">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  :value="volume"
                  @input="setVolume"
                  class="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer volume-slider group-hover/volume:bg-white/30 transition-colors">
              </div>
            </div>

            <!-- Time Display -->
            <div class="text-white/90 text-sm font-mono">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowLeftIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/vue/24/solid'

export default {
  name: 'CustomVideoPlayer',
  components: {
    PlayIcon,
    PauseIcon,
    ArrowLeftIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon
  },
  props: {
    videoUrl: {
      type: String,
      required: true
    },
    movieTitle: {
      type: String,
      required: true
    }
  },
  emits: ['timeupdate', 'play', 'pause', 'go-back'],
  data() {
    return {
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: false,
      isPaused: true,
      showControls: false,
      controlsTimeout: null,
      isDragging: false,
      hideControlsTimer: null
    }
  },
  computed: {
    progressPercent() {
      if (this.duration === 0) return 0
      return (this.currentTime / this.duration) * 100
    }
  },
  mounted() {
    this.setupVideo()
    // Add mouse move and up listeners for dragging
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  },
  beforeUnmount() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout)
    }
    if (this.hideControlsTimer) {
      clearTimeout(this.hideControlsTimer)
    }
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  },
  watch: {
    videoUrl(newUrl, oldUrl) {
      if (newUrl !== oldUrl && this.$refs.videoElement) {
        // Video URL changed, reload video
        this.$refs.videoElement.load()
        this.currentTime = 0
        this.duration = 0
        this.isPaused = true
        // Auto-play after load
        this.$refs.videoElement.addEventListener('loadeddata', () => {
          this.$refs.videoElement.play()
          this.isPaused = false
        }, { once: true })
      }
    }
  },
  methods: {
    setupVideo() {
      const video = this.$refs.videoElement
      if (video) {
        video.volume = this.volume
        video.muted = this.isMuted
      }
      // Auto-hide controls after 3 seconds if video is playing
      if (!this.isPaused) {
        this.startHideControlsTimer()
      }
    },
    handleVideoClick(event) {
      // Don't toggle if clicking on controls
      if (event.target.closest('.pointer-events-auto')) {
        return
      }
      this.togglePlayPause()
    },
    onMouseEnter() {
      this.showControls = true
      this.clearHideControlsTimer()
    },
    onMouseLeave() {
      if (!this.isPaused) {
        this.startHideControlsTimer()
      }
    },
    onMouseMove() {
      this.showControls = true
      this.clearHideControlsTimer()
      if (!this.isPaused) {
        this.startHideControlsTimer()
      }
    },
    startHideControlsTimer() {
      this.clearHideControlsTimer()
      this.hideControlsTimer = setTimeout(() => {
        if (!this.isPaused) {
          this.showControls = false
        }
      }, 3000) // Hide after 3 seconds
    },
    clearHideControlsTimer() {
      if (this.hideControlsTimer) {
        clearTimeout(this.hideControlsTimer)
        this.hideControlsTimer = null
      }
    },
    togglePlayPause() {
      const video = this.$refs.videoElement
      if (!video) return

      if (video.paused) {
        video.play()
        this.isPaused = false
        this.$emit('play')
        this.startHideControlsTimer()
      } else {
        video.pause()
        this.isPaused = true
        this.$emit('pause')
        this.showControls = true
        this.clearHideControlsTimer()
      }
    },
    onPlay() {
      this.isPaused = false
      this.$emit('play')
      this.startHideControlsTimer()
    },
    onPause() {
      this.isPaused = true
      this.$emit('pause')
      this.showControls = true
      this.clearHideControlsTimer()
    },
    onTimeUpdate() {
      const video = this.$refs.videoElement
      if (video) {
        this.currentTime = video.currentTime
        this.$emit('timeupdate', Math.floor(video.currentTime))
      }
    },
    onVideoLoaded() {
      const video = this.$refs.videoElement
      if (video) {
        this.duration = video.duration
      }
    },
    startDragging(event) {
      this.isDragging = true
      this.seekTo(event)
    },
    onMouseMove(event) {
      if (this.isDragging) {
        this.seekTo(event)
      }
    },
    onMouseUp() {
      this.isDragging = false
    },
    seekTo(event) {
      const video = this.$refs.videoElement
      if (!video) return

      const progressBar = this.$refs.progressBar
      const rect = progressBar.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
      const newTime = percent * this.duration
      
      video.currentTime = newTime
      this.currentTime = newTime
    },
    toggleMute() {
      const video = this.$refs.videoElement
      if (!video) return

      this.isMuted = !this.isMuted
      video.muted = this.isMuted
    },
    setVolume(event) {
      const video = this.$refs.videoElement
      if (!video) return

      this.volume = parseFloat(event.target.value)
      video.volume = this.volume
      
      if (this.volume === 0) {
        this.isMuted = true
        video.muted = true
      } else if (this.isMuted) {
        this.isMuted = false
        video.muted = false
      }
    },
    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },
    handleGoBack() {
      this.$emit('go-back')
    },
    // Public methods for parent component
    play() {
      const video = this.$refs.videoElement
      if (video) {
        video.play()
        this.isPaused = false
      }
    },
    pause() {
      const video = this.$refs.videoElement
      if (video) {
        video.pause()
        this.isPaused = true
      }
    },
    getCurrentTime() {
      const video = this.$refs.videoElement
      return video ? Math.floor(video.currentTime) : 0
    },
    setCurrentTime(time) {
      const video = this.$refs.videoElement
      if (video) {
        video.currentTime = time
        this.currentTime = time
      }
    }
  }
}
</script>

<style scoped>
.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>

