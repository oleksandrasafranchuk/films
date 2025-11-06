<template>
  <div class="movie-list">
    <MovieCard
      v-for="movie in movies"
      :key="movie.id"
      :movie="movie"
      @click="$emit('select-movie', movie.id)"
    />
  </div>
</template>

<script>
import MovieCard from './MovieCard.vue'

export default {
  name: 'MovieList',
  components: {
    MovieCard,
  },
  props: {
    movies: {
      type: Array,
      required: true,
    },
  },
  emits: ['select-movie'],
}
</script>

<style scoped>
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .movie-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
}
</style>
