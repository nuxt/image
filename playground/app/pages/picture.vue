<template>
  <div>
    <nuxt-picture
      src="/images/colors.jpg"
      format="avif,webp"
      width="500"
      height="500"
      @load="isLoaded = true"
    />
    <p>Received onLoad event: {{ isLoaded }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'

const isLoaded = ref(false)
</script>
