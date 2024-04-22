<script setup>
import { debounce } from 'perfect-debounce'

const search = ref(null)
useServerSeoMeta({
  titleTemplate: '%s - Nuxt Image',
  ogSiteName: 'Nuxt Image',
  twitterCard: 'summary_large_image',
})
useHead({
  htmlAttrs: {
    lang: 'en',
  },
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
const { data: files } = useLazyFetch('/api/search.json', {
  default: () => [],
  server: false,
})
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())

// Provide
provide('navigation', navigation)

watch(() => search.value?.commandPaletteRef?.query, debounce((query) => {
  if (!query) return
  useTrackEvent('Search', { props: { query, results: `${search.value?.commandPaletteRef.results.length}` } })
}, 500))
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <Logo />
    </template>
    <template #right>
      <UColorModeButton v-if="!$colorMode.forced" />
      <UButton
        aria-label="Nuxt Website"
        icon="i-simple-icons-nuxtdotjs"
        to="https://nuxt.com"
        color="gray"
        variant="ghost"
      />
      <UButton
        aria-label="Nuxt on X"
        icon="i-simple-icons-x"
        to="https://x.com/nuxt_js"
        color="gray"
        variant="ghost"
      />
      <UButton
        aria-label="Nuxt Image on GitHub"
        icon="i-simple-icons-github"
        to="https://github.com/nuxt/image"
        color="gray"
        variant="ghost"
      />
    </template>
    <!-- Mobile panel -->
    <template
      v-if="$route.path !== '/'"
      #panel
    >
      <LazyUContentSearchButton
        size="md"
        class="w-full mb-4"
      />
      <LazyUNavigationTree
        :links="mapContentNavigation(navigation)"
        default-open
        :multiple="false"
      />
    </template>
  </UHeader>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UFooter :links="links">
    <template #left>
      <span class="text-sm">
        Published under <NuxtLink
          to="https://github.com/nuxt/image"
          target="_blank"
          class="underline"
        >
          MIT License
        </NuxtLink>
      </span>
    </template>
    <template #right>
      <UColorModeButton v-if="!$colorMode.forced" />
      <UButton
        aria-label="Nuxt Website"
        icon="i-simple-icons-nuxtdotjs"
        to="https://nuxt.com"
        color="gray"
        variant="ghost"
      />
      <UButton
        aria-label="Nuxt on X"
        icon="i-simple-icons-x"
        to="https://x.com/nuxt_js"
        color="gray"
        variant="ghost"
      />
      <UButton
        aria-label="Nuxt Image on GitHub"
        icon="i-simple-icons-github"
        to="https://github.com/nuxt/image"
        color="gray"
        variant="ghost"
      />
    </template>
  </UFooter>
  <ClientOnly>
    <LazyUContentSearch
      ref="search"
      :files="files"
      :navigation="navigation"
      :links="links"
    />
  </ClientOnly>
</template>
