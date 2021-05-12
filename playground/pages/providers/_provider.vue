<template>
  <div :class="$style.providerShowcase">
    <div
      v-for="(image, index) in modifierFixtures"
      :key="index"
      :class="$style.fixtureImage"
    >
      <div :class="$style.imageContainer">
        <NuxtImg
          v-bind="image"
          :src="filenames[$route.params.provider]"
          :provider="$route.params.provider"
        />
      </div>
      <pre>
        {{ JSON.stringify(image) }}
      </pre>
    </div>
  </div>
</template>

<script lang="ts">
import type { Context } from '@nuxt/types'
import { modifierFixtures } from '../../../test/providers'

const providers = [
  'cloudinary',
  'fastly',
  'imagekit',
  'imgix',
  'static',
  'twicpics',
  'storyblok',
  'vercel'
] as const

const filenames: Record<typeof providers[number], string> = {
  cloudinary: '/woman.jpg',
  fastly: '/transformation-class/image.jpg',
  imagekit: '/img/responsive_images_srcset_sizes_assets/big/1.jpeg',
  imgix: '/examples/butterfly.jpg',
  static: '/images/everest.jpg',
  twicpics: '/codepen/photo-1562034090-aae2d7ece5d6.jpg',
  storyblok: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
  // TODO: vercel
  vercel: ''
}

export default {
  validate ({ params, redirect }: Context) {
    if (!providers.includes(params.provider as 'static')) {
      redirect('/providers/static')
    }
    return true
  },
  data: () => ({
    modifierFixtures,
    filenames
  })
}
</script>

<style module>
.providerShowcase {
  padding: 2rem 4rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}
.fixtureImage {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.fixtureImage pre {
  white-space: normal;
}
.imageContainer {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  overflow: auto;
  max-width: 500px;
  max-height: 500px;
}
</style>
