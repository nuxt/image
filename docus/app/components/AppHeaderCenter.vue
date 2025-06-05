<script setup lang="ts">
const links = [{
  label: 'Documentation',
  icon: 'i-lucide-book-open',
  to: '/get-started/installation',
}, {
  label: 'Playground',
  icon: 'i-lucide-play',
  to: '/playground',
}, {
  label: 'Releases',
  icon: 'i-lucide-rocket',
  to: 'https://github.com/nuxt/image/releases',
  target: '_blank',
}]
</script>

<template>
  <UNavigationMenu :items="links" />
</template>
