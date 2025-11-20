<template>
  <div class="flex justify-center">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @click="$emit('select', movie.id)" />
    </div>
  </div>
</template>

<script>
import MovieCard from './MovieCard.vue'

export default {
  name: 'MovieGrid',
  components: {
    MovieCard
  },
  props: {
    movies: {
      type: Array,
      required: true
    }
  },
  emits: ['select']
}
</script>

