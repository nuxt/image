<script setup>
const title = 'Playground'
const description = 'Play online with our interactive Nuxt Image playground.'
useSeoMeta({
  title,
  ogTitle: `Nuxt Image Playground`,
  description,
})
defineOgImageComponent('Docs', {
  title,
  description,
})
</script>

<template>
  <div class="h-[calc(100vh-var(--header-height))] flex dark:bg-gray-950">
    <ClientOnly>
      <iframe
        class="dark:bg-gray-950"
        :src="`https://stackblitz.com/github/nuxt/image/tree/main/example?embed=1&file=app.vue&theme=${$colorMode.preference}`"
        width="100%"
        height="100%"
      />
    </ClientOnly>
  </div>
</template>
