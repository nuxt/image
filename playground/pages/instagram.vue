<template>
  <div class="container">
    <div v-for="i in 10" :key="i" class="card">
      <nuxt-picture
        placeholder
        class="picture"
        src="/images/damavand.jpg"
        fit="cover"
        height="300"
        format="webp"
      />
      <!-- <nuxt-img class="picture" src="/images/damavand.jpg" height="300" style="object-fit: cover;" /> -->
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
}

.card {
  margin: 30px;
  border: 1px solid white;
  padding: 20px;
  width: 80vw;
}

.picture {
  width: 100%;
  height: 300px;
}
</style>
