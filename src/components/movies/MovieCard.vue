<template>
  <div class="movie-card" @click="$emit('click')">
    <div class="image-container">
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="movie.title"
        loading="lazy"
        @error="imageError = true"
      />
      <div v-else class="no-image">No Image</div>
    </div>

    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <div class="movie-meta">
        <span class="rating">★ {{ movie.vote_average.toFixed(1) }}</span>
        <span class="year">{{ releaseYear }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import tmdbApi from '../../services/tmdbApi'

export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imageError: false,
    }
  },
  computed: {
    posterUrl() {
      if (this.imageError || !this.movie.poster_path) {
        return null
      }
      return tmdbApi.getImageUrl(this.movie.poster_path)
    },
    releaseYear() {
      return this.movie.release_date ? this.movie.release_date.split('-')[0] : 'N/A'
    },
  },
  emits: ['click'],
}
</script>

<style scoped>
.movie-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  box-shadow: 0 2px 8px var(--shadow-light);
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px var(--shadow-dark);
}

.image-container {
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
  background-color: var(--color-light);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 18px;
}

.movie-info {
  padding: 15px;
}

.movie-title {
  font-size: 16px;
  margin: 0 0 10px 0;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text-light);
}

.rating {
  color: var(--color-rating);
  font-weight: 600;
}
</style>
