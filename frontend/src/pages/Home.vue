<template>
  <div class="min-h-screen bg-gradient-to-b from-black via-theater-dark to-black">
    <!-- Navigation Bar -->
    <nav class="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <!-- Left Side: Theater Brand -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-gradient-to-br from-theater-primary to-theater-secondary rounded-ios-lg flex items-center justify-center shadow-ios">
              <FilmIcon class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Omar's Theater
            </h1>
          </div>
        </div>
        <!-- Right Side: Cloudflare Assignment (SVG left strictly alone, color only affects text, "Omar Syed" still accented) -->
        <div class="flex items-center space-x-3 bg-white/5 rounded-ios-lg px-4 py-2 shadow-ios border border-white/10 backdrop-blur-sm">
          <span class="text-gray-400 text-base font-medium pr-0.5">Assignment for</span>
          <!-- SVG logo MUST remain unstyled and untouched -->
          <img src="/cloudflare-logo.svg" alt="Cloudflare Logo" class="h-10 w-10 drop-shadow-md" />
          <!-- Only text and not SVG gets coloring/styling -->
          <span class="text-lg text-gray-400 font-medium px-1">•</span>
          <span class="text-gray-400 text-base font-medium pl-0.5">submitted by</span>
          <span class="font-bold text-orange-400 pl-1 drop-shadow-sm tracking-tight">Omar Syed</span>
        </div>
      </div>
    </nav>
    <!-- Hero Banner -->
    <div class="relative h-[85vh] overflow-hidden">
      <transition name="fade-slide" mode="out-in">
        <div 
          :key="currentMovieIndex"
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url(${encodeURI(featuredMovie.thumbnailUrl || featuredMovie.poster)})` }">
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
      </transition>
      
      <!-- Left Arrow -->
      <button
        @click="prevMovie"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all duration-200 flex items-center justify-center active:scale-95 border border-white/20">
        <ChevronLeftIcon class="w-6 h-6 text-white" />
      </button>

      <!-- Right Arrow -->
      <button
        @click="nextMovie"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all duration-200 flex items-center justify-center active:scale-95 border border-white/20">
        <ChevronRightIcon class="w-6 h-6 text-white" />
      </button>
      
      <div class="relative z-10 h-full flex flex-col justify-end pb-16 px-6 md:px-16 max-w-7xl mx-auto">
        <transition name="fade-slide" mode="out-in">
          <div :key="currentMovieIndex" class="max-w-2xl">
            <h1 class="text-6xl md:text-7xl font-bold mb-4 leading-tight drop-shadow-2xl">
              {{ featuredMovie.title }}
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed drop-shadow-lg">
              {{ featuredMovie.description }}
            </p>
            <div class="flex items-center space-x-4">
              <button 
                @click="watchMovie(featuredMovie.id)"
                class="group flex items-center space-x-3 bg-gradient-to-r from-theater-primary to-theater-secondary text-white px-8 py-4 rounded-ios-xl font-semibold hover:from-theater-primary/90 hover:to-theater-secondary/90 transition-all duration-200 shadow-ios-lg hover:shadow-ios-xl hover:scale-105 active:scale-95">
                <PlayIcon class="w-6 h-6" />
                <span>Play Now</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Movie Grid Section -->
    <div class="max-w-7xl mx-auto px-6 md:px-16 py-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Available Films
        </h2>
        <div class="flex items-center space-x-2 text-gray-400">
          <span class="text-sm">{{ movies.length }} films</span>
        </div>
      </div>
      <MovieGrid :movies="movies" @select="watchMovie" />
    </div>

    <!-- Footer -->
    <footer class="border-t border-white/10 mt-20 py-12">
      <div class="max-w-7xl mx-auto px-6 md:px-16">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <div class="w-8 h-8 bg-gradient-to-br from-theater-primary to-theater-secondary rounded-ios flex items-center justify-center">
            <FilmIcon class="w-5 h-5 text-white" />
          </div>
          <span class="text-gray-400 text-base md:text-lg font-medium">Omar's Theater</span>
        </div>
        <p class="text-center text-gray-500 text-base md:text-lg font-medium">
          AI-powered movie explanations • Built with Cloudflare Workers AI
        </p>
        <p class="text-center text-gray-600 text-sm md:text-base mt-2">
          Assignment for Cloudflare Application
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import MovieGrid from '../components/MovieGrid.vue'
import { movies } from '../data/movies.js'
import { PlayIcon, FilmIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'Home',
  components: {
    MovieGrid,
    PlayIcon,
    FilmIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  },
  data() {
    return {
      movies: movies,
      currentMovieIndex: 0
    }
  },
  computed: {
    featuredMovie() {
      return this.movies[this.currentMovieIndex] || {}
    }
  },
  methods: {
    watchMovie(id) {
      this.$router.push(`/watch/${id}`)
    },
    nextMovie() {
      this.currentMovieIndex = (this.currentMovieIndex + 1) % this.movies.length
    },
    prevMovie() {
      this.currentMovieIndex = (this.currentMovieIndex - 1 + this.movies.length) % this.movies.length
    }
  }
}
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
