<template>
  <NuxtLayout>
    <!-- https://image.nuxt.com/usage/nuxt-picture -->
    <!-- https://image.nuxt.com/usage/nuxt-img -->
    <figure>
      <nuxt-picture
        src="/images/mountains.jpg"
        width="3750"
        height="2500"
        sizes="xs:200px md:500px lg:1024"
      />
      <figcaption class="text-center text-gray-600 text-xs mt-3">
        Photo by <a href="https://unsplash.com/@kydroon" target="_blank" class="underline">Kurt Cotoaga</a> on <a href="https://unsplash.com/s/photos/mountain" target="_blank" class="underline">Unsplash</a>
      </figcaption>
    </figure>
  </NuxtLayout>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
