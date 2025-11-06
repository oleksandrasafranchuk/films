<template>
  <div class="search-container">
    <input
      v-model="searchQuery"
      @input="handleSearch"
      type="text"
      placeholder="Search movies..."
      class="search-input"
    />
  </div>
</template>

<script>
export default {
  name: 'MovieSearch',
  data() {
    return {
      searchQuery: '',
      debounceTimer: null,
    }
  },
  emits: ['search'],
  methods: {
    handleSearch() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.$emit('search', this.searchQuery)
      }, 500)
    },
  },
}
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: none;
  margin-top: 5px;
  border-radius: 20px;
  font-size: 14px;
  box-sizing: border-box;
  transition: box-shadow 0.2s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .search-container {
    justify-content: center;
  }
  .search-input {
    max-width: 200px;
    padding: 12px 30px;
    font-size: 14px;
    margin-top: 5px;
  }
}
</style>
