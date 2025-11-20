<template>
  <div class="min-h-screen bg-gradient-to-b from-black via-theater-dark to-black">
    <!-- Navigation Bar -->
    <nav class="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-br from-theater-primary to-theater-secondary rounded-ios-lg flex items-center justify-center shadow-ios">
            <FilmIcon class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Omars Theater
          </h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 rounded-ios bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
            <span class="text-sm font-medium">Browse</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Banner -->
    <div class="relative h-[85vh] overflow-hidden">
      <div 
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${featuredMovie.thumbnailUrl || featuredMovie.poster})` }">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      </div>
      
      <div class="relative z-10 h-full flex flex-col justify-end pb-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div class="max-w-2xl">
          <h1 class="text-6xl md:text-7xl font-bold mb-4 leading-tight drop-shadow-2xl">
            {{ featuredMovie.title }}
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed drop-shadow-lg">
            {{ featuredMovie.description }}
          </p>
          <div class="flex items-center space-x-4">
            <button 
              @click="watchMovie(featuredMovie.id)"
              class="group flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-ios-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-ios-lg hover:shadow-ios-xl hover:scale-105 active:scale-95">
              <PlayIcon class="w-6 h-6" />
              <span>Play Now</span>
            </button>
            <button 
              class="flex items-center space-x-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-ios-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20">
              <InformationCircleIcon class="w-6 h-6" />
              <span>More Info</span>
            </button>
          </div>
        </div>
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
          <span class="text-gray-400 text-sm">Omars Theater</span>
        </div>
        <p class="text-center text-gray-500 text-sm">
          AI-powered movie explanations • Built with Cloudflare Workers AI
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import MovieGrid from '../components/MovieGrid.vue'
import { movies } from '../data/movies.js'
import { PlayIcon, InformationCircleIcon, FilmIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'Home',
  components: {
    MovieGrid,
    PlayIcon,
    InformationCircleIcon,
    FilmIcon
  },
  data() {
    return {
      movies: movies
    }
  },
  computed: {
    featuredMovie() {
      return this.movies[0] || {}
    }
  },
  methods: {
    watchMovie(id) {
      this.$router.push(`/watch/${id}`)
    }
  }
}
</script>
