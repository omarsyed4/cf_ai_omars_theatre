<template>
  <div
    class="group cursor-pointer"
    @click="$emit('click')">
    <div class="relative aspect-video bg-theater-gray rounded-ios-xl overflow-hidden mb-4 shadow-ios hover:shadow-ios-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
      <img
        v-if="movie.thumbnailUrl || movie.poster"
        :src="encodeURI(movie.thumbnailUrl || movie.poster)"
        :alt="movie.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        @error="handleImageError" />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-theater-gray to-theater-dark">
        <FilmIcon class="w-16 h-16 text-gray-500" />
      </div>
      
      <!-- Overlay with play button -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
        <div class="transform scale-75 group-hover:scale-100 transition-all duration-300 opacity-0 group-hover:opacity-100">
          <div class="w-20 h-20 bg-gradient-to-br from-theater-primary to-theater-secondary backdrop-blur-md rounded-full flex items-center justify-center shadow-ios-xl">
            <PlayIcon class="w-10 h-10 text-white ml-1" />
          </div>
        </div>
      </div>

      <!-- Duration badge -->
      <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-ios border border-white/20">
        <span class="text-xs font-medium text-white">{{ movie.duration }}</span>
      </div>
    </div>
    
    <div class="px-1">
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-lg font-semibold text-white group-hover:text-theater-primary transition-colors duration-200">
          {{ movie.title }}
        </h3>
        <span v-if="movie.year" class="text-xs text-gray-500">{{ movie.year }}</span>
      </div>
      <p class="text-sm text-gray-400 line-clamp-2">
        {{ movie.description }}
      </p>
    </div>
  </div>
</template>

<script>
import { PlayIcon, FilmIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'MovieCard',
  components: {
    PlayIcon,
    FilmIcon
  },
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  methods: {
    handleImageError(event) {
      console.error('Failed to load image:', event.target.src)
      // Fallback to placeholder or hide image
      event.target.style.display = 'none'
    }
  }
}
</script>
