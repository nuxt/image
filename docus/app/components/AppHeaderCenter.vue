<script setup lang="ts">
const links = [{
  label: 'Documentation',
  to: '/get-started/installation',
}, {
  label: 'Playground',
  to: '/playground',
}, {
  label: 'Releases',
  to: 'https://github.com/nuxt/image/releases',
  target: '_blank',
}]
</script>

<template>
  <UNavigationMenu
    :items="links"
    variant="link"
  />
</template>
