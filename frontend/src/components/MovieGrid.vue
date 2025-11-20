<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <MovieCard
      v-for="movie in movies"
      :key="movie.id"
      :movie="movie"
      @click="$emit('select', movie.id)" />
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

