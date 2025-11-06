<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">
        <h1><router-link to="/home" class="logo-link">Movie </router-link></h1>
      </div>

      <slot name="search"></slot>

      <nav class="nav-menu">
        <BaseButton variant="ghost" @click="$emit('logout')"> Logout </BaseButton>
      </nav>
    </div>
  </header>
</template>

<script>
import BaseButton from '../common/BaseButton.vue'

export default {
  name: 'AppHeader',
  components: {
    BaseButton,
  },
  emits: ['logout'],
}
</script>

<style scoped>
.app-header {
  background: var(--color-primary);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo h1 {
  font-family: 'Dancing Script', cursive;
  margin: 0;
  font-size: 40px;
  cursor: pointer;
}
.logo-link {
  color: var(--color-white);
  text-decoration: none;
}

.nav-menu {
  margin-left: auto;
  display: flex;
  align-items: center;
}
@media (max-width: 768px) {
  .container {
    flex-direction: row;
    gap: 10px;
  }
  .logo h1 {
    font-size: 30px;
  }
  .nav-menu {
    margin-left: 1px;
  }
}
</style>
