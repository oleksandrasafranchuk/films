<template>
  <div class="filter-container">
    <h3>Filter by Genre</h3>
    <div class="genre-buttons">
      <BaseButton
        variant="secondary"
        @click="selectGenre(null)"
        :class="{ active: selectedGenre === null }"
      >
        All
      </BaseButton>
      <BaseButton
        v-for="genre in genres"
        :key="genre.id"
        variant="secondary"
        @click="selectGenre(genre.id)"
        :class="{ active: selectedGenre === genre.id }"
      >
        {{ genre.name }}
      </BaseButton>
    </div>
  </div>
</template>
<script>
import BaseButton from '../common/BaseButton.vue'
export default {
  name: 'MovieFilter',
  components: { BaseButton },
  props: {
    genres: { type: Array, required: true },
    selectedGenre: { type: [Number, null], default: null },
  },
  emits: ['filter'],
  methods: {
    selectGenre(genreId) {
      this.$emit('filter', genreId)
    },
  },
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 30px;
}

h3 {
  margin-bottom: 15px;
  color: var(--color-text);
}

.genre-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.genre-buttons .base-button.active {
  background-color: var(--color-primary);
  color: var(--color-white);
}
@media (max-width: 768px) {
  .genre-buttons {
    justify-content: center;
  }
}
</style>
