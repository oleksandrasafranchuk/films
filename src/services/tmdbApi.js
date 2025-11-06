import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

if (!API_KEY) {
  console.error('TMDB API key is not defined. Please set VITE_TMDB_API_KEY in .env file')
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
})

export default {
  async getPopularMovies(page = 1) {
    try {
      const response = await api.get('/movie/popular', {
        params: { page },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching popular movies:', error)
      throw error
    }
  },

  async searchMovies(query, page = 1) {
    try {
      const response = await api.get('/search/movie', {
        params: { query, page },
      })
      return response.data
    } catch (error) {
      console.error('Error searching movies:', error)
      throw error
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

  async getGenres() {
    try {
      const response = await api.get('/genre/movie/list')
      return response.data.genres
    } catch (error) {
      console.error('Error fetching genres:', error)
      throw error
    }
  },

  getImageUrl(path) {
    return path ? `${IMAGE_BASE_URL}${path}` : null
  },
}
