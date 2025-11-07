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
        <transition name="slide-fade">
          <div v-show="filtersVisible">
            <MovieFilter :genres="genres" :selectedGenre="selectedGenre" @filter="handleFilter" />
            <YearFilter ref="yearFilter" @filter="handleYearFilter" />
          </div>
        </transition>

        <transition name="fade" mode="out-in">
          <div v-if="(loading || isInitialLoad) && movies.length === 0" key="loader" class="loader">
            <div class="skeleton-grid">
              <div v-for="n in 10" :key="n" class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
              </div>
            </div>
          </div>
          <div v-else-if="error" key="error" class="error-message">
            <p>Error: {{ error }}</p>
            <BaseButton variant="primary" @click="loadMovies">Retry</BaseButton>
          </div>
          <div
            v-else-if="!loading && !isInitialLoad && displayMovies.length === 0"
            key="no-results"
            class="no-results"
          >
            <p>No movies found</p>
          </div>
          <div v-else key="movies">
            <MovieList :movies="displayMovies" @select-movie="goToMovie" />

            <div v-if="loading && movies.length > 0" class="loader-more">
              <div class="spinner"></div>
              Loading more...
            </div>
          </div>
        </transition>

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
      selectedYearRange: null,
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      observer: null,
      filtersVisible: false,
      debounceTimer: null,
      isInitialLoad: true,
    }
  },
  async created() {
    await this.loadGenres()
    await this.initializeYearRange()
    this.restoreFiltersFromSession()
    await this.loadMovies()
  },
  mounted() {
    this.setupIntersectionObserver()
    this.$nextTick(() => {
      const savedYearRange = sessionStorage.getItem('selectedYearRange')
      if (savedYearRange && this.$refs.yearFilter) {
        const parsed = JSON.parse(savedYearRange)
        this.$refs.yearFilter.minYear = parsed.minYear
        this.$refs.yearFilter.maxYear = parsed.maxYear
      }
    })
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
  },
  methods: {
    async initializeYearRange() {
      try {
        const yearRange = await tmdbApi.getYearRange()
        const savedYearRange = sessionStorage.getItem('selectedYearRange')
        if (savedYearRange) {
          this.selectedYearRange = JSON.parse(savedYearRange)
        } else {
          this.selectedYearRange = yearRange
        }
        if (this.$refs.yearFilter) {
          this.$refs.yearFilter.setYearRange(yearRange.minYear, yearRange.maxYear)
          if (savedYearRange) {
            const parsed = JSON.parse(savedYearRange)
            this.$refs.yearFilter.minYear = parsed.minYear
            this.$refs.yearFilter.maxYear = parsed.maxYear
          }
        }
      } catch (error) {
        console.error('Failed to initialize year range:', error)
        const currentYear = new Date().getFullYear()
        this.selectedYearRange = { minYear: 1900, maxYear: currentYear }
      }
    },

    saveFiltersToSession() {
      sessionStorage.setItem('selectedGenre', JSON.stringify(this.selectedGenre))
      sessionStorage.setItem('selectedYearRange', JSON.stringify(this.selectedYearRange))
      sessionStorage.setItem('searchQuery', this.searchQuery)
    },

    restoreFiltersFromSession() {
      const savedGenre = sessionStorage.getItem('selectedGenre')
      const savedYearRange = sessionStorage.getItem('selectedYearRange')
      const savedSearchQuery = sessionStorage.getItem('searchQuery')

      if (savedGenre !== null) {
        this.selectedGenre = JSON.parse(savedGenre)
      }
      if (savedYearRange !== null) {
        this.selectedYearRange = JSON.parse(savedYearRange)
      }
      if (savedSearchQuery !== null) {
        this.searchQuery = savedSearchQuery
      }
    },

    setupIntersectionObserver() {
      const options = { root: null, rootMargin: '300px', threshold: 0.1 }
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
        let data
        if (this.searchQuery.trim()) {
          data = await tmdbApi.searchMovies(
            this.searchQuery,
            this.currentPage,
            this.selectedYearRange,
          )
        } else if (this.selectedGenre !== null) {
          data = await tmdbApi.getMoviesByGenre(
            this.selectedGenre,
            this.currentPage,
            this.selectedYearRange,
          )
        } else {
          data = await tmdbApi.getPopularMovies(this.currentPage, this.selectedYearRange)
        }

        const newMovies = data.results || []
        if (reset) {
          this.movies = newMovies
        } else {
          const allMovies = [...this.movies, ...newMovies]
          this.movies = allMovies.filter(
            (movie, idx, arr) => arr.findIndex((m) => m.id === movie.id) === idx,
          )
        }
        this.displayMovies = this.movies
        this.totalPages = data.total_pages || 1
      } catch (error) {
        console.error('Failed to load movies:', error)
        this.error = error.message || 'Failed to load movies'
      } finally {
        this.loading = false
        this.isInitialLoad = false
      }
    },

    async loadMoreMovies() {
      if (this.currentPage >= this.totalPages || this.loading) return
      this.currentPage++
      await this.loadMovies(false)
    },

    async handleFilter(genreId) {
      this.selectedGenre = genreId
      this.saveFiltersToSession()
      await this.loadMovies(true)
    },

    async handleSearch(query) {
      this.searchQuery = query
      this.selectedGenre = null
      this.saveFiltersToSession()
      await this.loadMovies(true)
    },

    handleYearFilter(yearRange) {
      this.selectedYearRange = yearRange
      this.saveFiltersToSession()

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      this.debounceTimer = setTimeout(() => {
        this.loadMovies(true)
      }, 500)
    },

    goToMovie(movieId) {
      sessionStorage.setItem('movieScrollPosition', window.scrollY)
      this.$router.push({ name: 'MovieDetail', params: { id: movieId } })
    },

    handleLogout() {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userData')
      sessionStorage.removeItem('selectedGenre')
      sessionStorage.removeItem('selectedYearRange')
      sessionStorage.removeItem('searchQuery')
      sessionStorage.removeItem('movieScrollPosition')
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

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.skeleton-card {
  background: var(--color-white);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px var(--shadow-light);
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 2/3;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 10px;
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text.short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.loader {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: var(--color-primary);
}

.loader-more {
  padding: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  color: var(--color-primary);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid var(--color-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  padding: 40px;
  color: var(--color-error);
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

  .skeleton-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
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

  .skeleton-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
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
