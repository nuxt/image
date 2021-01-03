<template>
  <div class="container">
    <nuxt-link to="/full-width">Full Width</nuxt-link>
    <nuxt-link to="/original">Original</nuxt-link>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.container .image {
  width: 320px;
  margin: 10px;
  border-radius: 3px;
}
</style>

<script>
export default {}
</script>
