<template>
  <div class="home-view">
    <AppHeader @logout="handleLogout">
      <template #search>
        <MovieSearch @search="handleSearch" class="search-input" />
      </template>
    </AppHeader>

    <main class="main-content">
      <div class="container">
        <button class="toggle-filters-btn" @click="filtersVisible = !filtersVisible">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="filter-icon"
            aria-hidden="true"
          >
            <path
              d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
            />
          </svg>

          Filters
        </button>

        <div v-show="filtersVisible">
          <MovieFilter :genres="genres" @filter="handleFilter" />
          <YearFilter ref="yearFilter" @filter="handleYearFilter" />
        </div>

        <div v-if="loading && movies.length === 0" class="loader">Loading...</div>
        <div v-else-if="error" class="error-message">
          <p>Error: {{ error }}</p>
          <BaseButton variant="primary" @click="loadMovies">Retry</BaseButton>
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
import YearFilter from '../components/movies/YearFilter.vue'
import MovieList from '../components/movies/MovieList.vue'
import tmdbApi from '../services/tmdbApi'
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  name: 'HomeView',
  components: {
    AppHeader,
    AppFooter,
    MovieSearch,
    MovieFilter,
    YearFilter,
    MovieList,
    BaseButton,
  },
  data() {
    return {
      movies: [],
      displayMovies: [],
      genres: [],
      loading: false,
      error: null,
      selectedGenre: null,
      selectedYearRange: { minYear: 1990, maxYear: 2026 },
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      observer: null,
      filtersVisible: false, // для керування видимістю фільтрів
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
        rootMargin: '300px',
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
          this.updateYearRange()
        } else {
          this.movies = [...this.movies, ...(data.results || [])]
        }

        this.totalPages = data.total_pages || 1
        this.applyFilters()
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
          this.updateYearRange()
        } else {
          this.movies = [...this.movies, ...(data.results || [])]
        }

        this.totalPages = data.total_pages || 1
        this.applyFilters()
      } catch (error) {
        console.error('Search failed:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    updateYearRange() {
      if (this.movies.length === 0) return

      const years = this.movies
        .map((m) => {
          const date = m.release_date
          return date ? parseInt(date.split('-')[0]) : 0
        })
        .filter((y) => y > 0)

      if (years.length > 0) {
        const minYear = Math.min(...years)
        const maxYear = Math.max(...years)

        if (this.$refs.yearFilter) {
          this.$refs.yearFilter.setYearRange(minYear, maxYear)
          this.selectedYearRange = { minYear, maxYear }
        }
      }
    },

    handleFilter(genreId) {
      this.selectedGenre = genreId
      this.applyFilters()
    },

    handleYearFilter(yearRange) {
      this.selectedYearRange = yearRange
      this.applyFilters()
    },

    applyFilters() {
      let filtered = this.movies
      if (this.selectedGenre !== null) {
        filtered = filtered.filter((movie) => movie.genre_ids.includes(this.selectedGenre))
      }
      filtered = filtered.filter((movie) => {
        const releaseYear = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0
        return (
          releaseYear >= this.selectedYearRange.minYear &&
          releaseYear <= this.selectedYearRange.maxYear
        )
      })

      this.displayMovies = filtered
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
  font-family: 'Lora', serif;
}

.error-message p {
  margin-bottom: 20px;
  font-size: 18px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  font-size: 20px;
  color: var(--color-text-light);
  background: var(--color-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--shadow-light);
}

.load-more-trigger {
  height: 10px;
  margin-top: 20px;
}

.search-input {
  flex: 1;
}

.toggle-filters-btn {
  background: transparent;
  border: none;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 20px;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  line-height: 1.2;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.toggle-filters-btn:hover {
  color: var(--color-dark);
  transform: translateY(-2px);
}

.toggle-filters-btn .filter-icon {
  width: 1.2em;
  height: 1.2em;
  flex: 0 0 auto;
  display: inline-block;
  vertical-align: middle;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
}

@media (max-width: 768px) {
  .main-content {
    padding: 30px 15px;
  }

  .loader,
  .loader-more {
    padding: 30px 15px;
    font-size: 16px;
  }

  .no-results {
    padding: 40px 15px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 20px 10px;
  }

  .loader,
  .loader-more {
    padding: 20px 10px;
    font-size: 14px;
  }

  .no-results {
    padding: 30px 10px;
    font-size: 14px;
  }
}
</style>
