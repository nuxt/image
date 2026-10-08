<template>
  <div>
    <h2>NuxtImg</h2>
    <NuxtImg
      src="/images/nuxt.png"
      width="300"
      height="300"
      preload
    />
    <h2>NuxtPicture</h2>
    <NuxtPicture
      src="/images/nuxt.png"
      width="600"
      height="600"
    />
    <h2>Server-side useImage</h2>
    <pre>{{ data }}</pre>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/image')
</script>
