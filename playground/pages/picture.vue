<template>
  <div>
    <h1>Original</h1>
    <nuxt-picture
      src="/images/colors.jpg"
      format="avif,webp"
      width="500"
      height="500"
      @load="isLoaded = true"
    />
    <p>Received onLoad event: {{ isLoaded }}</p>
    <h1>Placeholder</h1>
    <nuxt-picture
      src="/images/colors.jpg"
      placeholder
      format="avif,webp"
      width="500"
      height="500"
      @load="isLoaded2 = true"
    />
    <p>Received onLoad event: {{ isLoaded2 }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'

const isLoaded = ref(false)
const isLoaded2 = ref(false)
</script>
