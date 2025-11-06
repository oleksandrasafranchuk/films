<template>
  <div class="home-view">
    <AppHeader @logout="handleLogout">
      <template #search>
        <MovieSearch @search="handleSearch" class="seach-input" />
      </template>
    </AppHeader>

    <main class="main-content">
      <div class="container">
        <MovieFilter :genres="genres" @filter="handleFilter" />

        <div v-if="loading && movies.length === 0" class="loader">Loading...</div>
        <div v-else-if="error" class="error-message">
          <p>Error: {{ error }}</p>
          <button @click="loadMovies">Retry</button>
        </div>
        <div v-else-if="displayMovies.length === 0" class="no-results">
          <p>No movies found</p>
        </div>
        <MovieList v-else :movies="displayMovies" @select-movie="goToMovie" />

        <div v-if="loading && movies.length > 0" class="loader-more">Loading more...</div>

        <div ref="loadMoreTrigger" class="load-more-trigger"></div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import MovieSearch from '../components/movies/MovieSearch.vue'
import MovieFilter from '../components/movies/MovieFilter.vue'
import MovieList from '../components/movies/MovieList.vue'
import tmdbApi from '../services/tmdbApi'

export default {
  name: 'HomeView',
  components: {
    AppHeader,
    AppFooter,
    MovieSearch,
    MovieFilter,
    MovieList,
  },
  data() {
    return {
      movies: [],
      displayMovies: [],
      genres: [],
      loading: false,
      error: null,
      selectedGenre: null,
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      observer: null,
    }
  },
  async created() {
    await this.loadGenres()
    await this.loadMovies()
  },
  mounted() {
    this.setupIntersectionObserver()
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.loading && this.currentPage < this.totalPages) {
            this.loadMoreMovies()
          }
        })
      }, options)

      if (this.$refs.loadMoreTrigger) {
        this.observer.observe(this.$refs.loadMoreTrigger)
      }
    },

    async loadGenres() {
      try {
        this.genres = await tmdbApi.getGenres()
      } catch (error) {
        console.error('Failed to load genres:', error)
      }
    },

    async loadMovies(reset = true) {
      if (reset) {
        this.currentPage = 1
        this.movies = []
      }

      this.loading = true
      this.error = null

      try {
        const data = await tmdbApi.getPopularMovies(this.currentPage)

        if (reset) {
          this.movies = data.results || []
        } else {
          this.movies = [...this.movies, ...(data.results || [])]
        }

        this.totalPages = data.total_pages || 1
        this.displayMovies = this.selectedGenre
          ? this.filterByGenre(this.movies, this.selectedGenre)
          : this.movies
      } catch (error) {
        console.error('Failed to load movies:', error)
        this.error = error.message || 'Failed to load movies'
      } finally {
        this.loading = false
      }
    },

    async loadMoreMovies() {
      if (this.currentPage >= this.totalPages || this.loading) {
        return
      }

      this.currentPage++

      if (this.searchQuery.trim()) {
        await this.searchMovies(this.searchQuery, false)
      } else {
        await this.loadMovies(false)
      }
    },

    async handleSearch(query) {
      this.searchQuery = query
      this.selectedGenre = null

      if (query.trim()) {
        await this.searchMovies(query, true)
      } else {
        await this.loadMovies(true)
      }
    },

    async searchMovies(query, reset = true) {
      if (reset) {
        this.currentPage = 1
        this.movies = []
      }

      this.loading = true
      this.error = null

      try {
        const data = await tmdbApi.searchMovies(query, this.currentPage)

        if (reset) {
          this.movies = data.results || []
        } else {
          this.movies = [...this.movies, ...(data.results || [])]
        }

        this.totalPages = data.total_pages || 1
        this.displayMovies = this.movies
      } catch (error) {
        console.error('Search failed:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    handleFilter(genreId) {
      this.selectedGenre = genreId
      this.displayMovies = genreId === null ? this.movies : this.filterByGenre(this.movies, genreId)
    },

    filterByGenre(movies, genreId) {
      return movies.filter((movie) => movie.genre_ids.includes(genreId))
    },

    goToMovie(movieId) {
      this.$router.push({ name: 'MovieDetail', params: { id: movieId } })
    },

    handleLogout() {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userData')
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-light);
}

.main-content {
  flex: 1;
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.loader,
.loader-more {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: var(--color-primary);
}

.loader-more {
  padding: 20px;
  font-size: 16px;
}

.error-message {
  text-align: center;
  padding: 40px;
  color: var(--color-error);
}

.error-message button {
  margin-top: 20px;
  padding: 10px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: var(--color-text-light);
}

.load-more-trigger {
  height: 10px;
  margin-top: 20px;
}
</style>
