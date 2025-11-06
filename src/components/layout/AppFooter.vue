<template>
  <footer class="app-footer">
    <div class="container">
      <p>&copy; 2025 <span> Movie </span></p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
}
</script>

<style scoped>
.app-footer {
  background: var(--color-primary);
  color: white;
  padding: 30px 20px;
  margin-top: auto;
}
p span {
  font-family: 'Dancing Script', cursive;
  font-size: 20px;
  margin-left: 5px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
</style>
