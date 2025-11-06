<template>
  <div class="detail-view">
    <AppHeader @logout="handleLogout" :show-logout="false" />

    <main class="detail-content">
      <div v-if="loading" class="loader">Loading...</div>

      <div v-else-if="movie" class="movie-detail">
        <div class="back-wrapper">
          <BaseButton variant="primary" @click="goBack">← Back</BaseButton>
        </div>

        <div class="detail-grid">
          <div class="poster-section">
            <img v-if="posterUrl" :src="posterUrl" :alt="movie.title" />
            <div v-else class="no-poster">No Image</div>
          </div>

          <div class="info-section">
            <h1>{{ movie.title }}</h1>
            <p class="tagline" v-if="movie.tagline">{{ movie.tagline }}</p>

            <div class="meta-info">
              <span class="rating">★ {{ movie.vote_average.toFixed(1) }}/10</span>
              <span>{{ formatDate(movie.release_date) }}</span>
              <span>{{ movie.runtime }} min</span>
            </div>

            <div class="genres">
              <span v-for="genre in movie.genres" :key="genre.id" class="genre-badge">
                {{ genre.name }}
              </span>
            </div>

            <div class="overview">
              <h2>Overview</h2>
              <p>{{ movie.overview || 'No overview available' }}</p>
            </div>

            <div class="additional-info" v-if="movie.budget || movie.revenue">
              <div class="info-item" v-if="movie.budget">
                <strong>Budget:</strong>
                {{ formatMoney(movie.budget) }}
              </div>
              <div class="info-item" v-if="movie.revenue">
                <strong>Revenue:</strong>
                {{ formatMoney(movie.revenue) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import BaseButton from '../components/common/BaseButton.vue'
import tmdbApi from '../services/tmdbApi'

export default {
  name: 'MovieDetailView',
  components: {
    AppHeader,
    AppFooter,
    BaseButton,
  },
  data() {
    return {
      movie: null,
      loading: false,
    }
  },
  computed: {
    posterUrl() {
      return this.movie?.poster_path ? tmdbApi.getImageUrl(this.movie.poster_path) : null
    },
  },
  async created() {
    await this.loadMovie()
  },
  methods: {
    async loadMovie() {
      this.loading = true
      try {
        const id = this.$route.params.id
        this.movie = await tmdbApi.getMovieDetails(id)
      } catch (error) {
        console.error('Failed to load movie:', error)
      } finally {
        this.loading = false
      }
    },

    goBack() {
      this.$router.back()
    },

    handleLogout() {
      localStorage.removeItem('isAuthenticated')
      this.$router.push('/')
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = String(date.getFullYear())
      return `${day}.${month}.${year}`
    },

    formatMoney(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    },
  },
}
</script>

<style scoped>
.detail-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-light);
}

.detail-content {
  flex: 1;
  padding: 40px 20px;
}

.movie-detail {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px var(--shadow-light);
}

.detail-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
}

.poster-section img,
.no-poster {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 15px var(--shadow-light);
}

.no-poster {
  aspect-ratio: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 24px;
}

.info-section h1 {
  margin: 0 0 10px 0;
  color: var(--color-text);
}

.tagline {
  font-style: italic;
  color: var(--color-text-light);
  margin-bottom: 20px;
}

.meta-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.rating {
  color: var(--color-rating);
  font-weight: 600;
  font-size: 18px;
}

.genres {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.genre-badge {
  padding: 6px 12px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: 15px;
  font-size: 14px;
}

.overview h2 {
  margin-bottom: 15px;
  color: var(--color-text);
}

.overview p {
  line-height: 1.6;
  color: var(--color-text-light);
}

.additional-info {
  margin-top: 30px;
}

.info-item {
  margin-bottom: 10px;
  color: var(--color-text-light);
}

.loader {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: var(--color-primary);
}

.back-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .poster-section {
    max-width: 300px;
    margin: 0 auto;
  }

  .info-section h1 {
    text-align: center;
  }

  .tagline {
    text-align: center;
  }

  .meta-info {
    justify-content: center;
  }

  .genres {
    justify-content: center;
  }

  .overview h2 {
    text-align: center;
  }

  .overview p {
    text-align: center;
  }

  .additional-info {
    text-align: center;
  }

  .back-wrapper {
    justify-content: center;
  }
}
</style>
