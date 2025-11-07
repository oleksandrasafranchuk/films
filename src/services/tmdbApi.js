import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

if (!API_KEY) {
  console.error('API key is not defined.')
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
})

export default {
  async getPopularMovies(page = 1, yearRange = null) {
    try {
      const params = { page }

      if (yearRange) {
        params['primary_release_date.gte'] = `${yearRange.minYear}-01-01`
        params['primary_release_date.lte'] = `${yearRange.maxYear}-12-31`
      }

      const response = await api.get('/discover/movie', {
        params: {
          sort_by: 'popularity.desc',
          ...params,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching popular movies:', error)
      throw error
    }
  },

  async searchMovies(query, page = 1, yearRange = null) {
    try {
      const params = { query, page }

      if (yearRange) {
        params['primary_release_date.gte'] = `${yearRange.minYear}-01-01`
        params['primary_release_date.lte'] = `${yearRange.maxYear}-12-31`
      }

      const response = await api.get('/search/movie', { params })
      return response.data
    } catch (error) {
      console.error('Error searching movies:', error)
      throw error
    }
  },

  async getGenres() {
    try {
      const response = await api.get('/genre/movie/list')
      return response.data.genres
    } catch (error) {
      console.error('Error fetching genres:', error)
      throw error
    }
  },

  async getMoviesByGenre(genreId, page = 1, yearRange = null) {
    try {
      const params = {
        with_genres: genreId,
        page,
      }

      if (yearRange) {
        params['primary_release_date.gte'] = `${yearRange.minYear}-01-01`
        params['primary_release_date.lte'] = `${yearRange.maxYear}-12-31`
      }

      const response = await api.get('/discover/movie', {
        params: {
          sort_by: 'popularity.desc',
          ...params,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching movies by genre:', error)
      throw error
    }
  },

  async getYearRange() {
    try {
      const newestResponse = await api.get('/discover/movie', {
        params: {
          sort_by: 'primary_release_date.desc',
          'primary_release_date.lte': `${new Date().getFullYear()}-12-31`,
          page: 1,
        },
      })

      const oldestResponse = await api.get('/discover/movie', {
        params: {
          sort_by: 'primary_release_date.asc',
          'primary_release_date.gte': '1900-01-01',
          page: 1,
        },
      })

      const newestYear = newestResponse.data.results[0]?.release_date
        ? parseInt(newestResponse.data.results[0].release_date.split('-')[0])
        : new Date().getFullYear()

      const oldestYear = oldestResponse.data.results[0]?.release_date
        ? parseInt(oldestResponse.data.results[0].release_date.split('-')[0])
        : 1900

      return { minYear: oldestYear, maxYear: newestYear }
    } catch (error) {
      console.error('Error fetching year range:', error)
      return { minYear: 1900, maxYear: new Date().getFullYear() }
    }
  },
  async getMovieDetails(id) {
    try {
      const response = await api.get(`/movie/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching movie details:', error)
      throw error
    }
  },

  getImageUrl(path) {
    return path ? `${IMAGE_BASE_URL}${path}` : null
  },
}
