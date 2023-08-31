<script setup>
const { mapContentNavigation } = useElementsHelpers()

const route = useRoute()
useServerSeoMeta({
  titleTemplate: '%s - Nuxt Image',
  ogSiteName: 'Nuxt Image',
  twitterCard: 'summary_large_image',
})
useHead({
  htmlAttrs: {
    lang: 'en',
  }
})
const links = [{
  label: 'Documentation',
  icon: 'i-heroicons-book-open-solid',
  to: '/get-started/installation',
}, {
  label: 'Playground',
  icon: 'i-ph-play-duotone',
  to: '/playground',
}, {
  label: 'Releases',
  icon: 'i-heroicons-rocket-launch-solid',
  to: 'https://github.com/nuxt/image/releases',
  target: '_blank',
}]

const enableDocsSearch = ref(false)
const files = shallowRef([])
onNuxtReady(async () => {
  files.value = await $fetch('/api/search.json')
  enableDocsSearch.value = true
})

// Provide
const navigation = useState()
provide('navigation', navigation)

if (process.server) {
  navigation.value = await fetchContentNavigation()
}
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <Logo />
    </template>
    <template #right>
      <UColorModeButton v-if="!$colorMode.forced" />
      <USocialButton aria-label="Nuxt Website" icon="i-simple-icons-nuxtdotjs" to="https://nuxt.com" />
      <USocialButton aria-label="Nuxt on X" icon="i-simple-icons-x" to="https://x.com/nuxt_js" />
      <USocialButton aria-label="Nuxt Image on GitHub" icon="i-simple-icons-github" to="https://github.com/nuxt/image" />
    </template>
    <!-- Mobile panel -->
    <template v-if="$route.path !== '/'" #panel>
      <LazyUDocsSearchButton size="md" class="w-full mb-4" />
      <LazyUNavigationTree :links="mapContentNavigation(navigation)" default-open :multiple="false" />
    </template>
  </UHeader>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UFooter :links="links">
    <template #left>
      <span class="text-sm">
        Published under <NuxtLink to="https://github.com/nuxt/image" target="_blank" class="underline">
          MIT License
        </NuxtLink>
      </span>
    </template>
    <template #right>
      <UColorModeButton v-if="!$colorMode.forced" />
      <USocialButton aria-label="Nuxt Website" icon="i-simple-icons-nuxtdotjs" to="https://nuxt.com" />
      <USocialButton aria-label="Nuxt on X" icon="i-simple-icons-x" to="https://x.com/nuxt_js" />
      <USocialButton aria-label="Nuxt Image on GitHub" icon="i-simple-icons-github" to="https://github.com/nuxt/image" />
    </template>
  </UFooter>
  <UDocsSearch v-if="enableDocsSearch" :files="files" :navigation="navigation" :links="links" />
</template>
