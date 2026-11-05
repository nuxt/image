<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue'

// `crossOrigin` is not part of Vue's ImgHTMLAttributes, but plain JS callers can
// still pass the camel-cased key, so the preload link should handle it too.
const camelCrossOrigin = { crossOrigin: 'anonymous' } as unknown as ImgHTMLAttributes
</script>

<template>
  <div>
    <h1>Preload no densities or sizes prop</h1>
    <nuxt-img
      src="/images/colors-no-densities-or-sizes-prop.jpg"
      width="500"
      height="500"
      densities="x1"
      preload
    />
    <h1>Preload with densities and no sizes prop</h1>
    <nuxt-img
      src="/images/colors-with-densities-and-no-sizes-prop.jpg"
      width="500"
      height="500"
      densities="x1 x2"
      preload
    />

    <h1>Preload with densities and sizes prop</h1>
    <nuxt-img
      src="/images/colors-with-densities-and-sizes-prop.jpg"
      width="500"
      height="500"
      sizes="100vw md:500px"
      densities="x1 x2"
      preload
    />

    <h1>Preload with densities, sizes prop and default fetch priority high</h1>
    <nuxt-img
      src="/images/colors-with-densities-sizes-and-fetchprio-prop.jpg"
      width="500"
      height="500"
      sizes="100vw md:500px"
      densities="x1 x2"
      :preload="{ fetchPriority: 'high' }"
    />

    <h1>Picture preload with crossorigin</h1>
    <nuxt-picture
      src="/images/damavand.jpg"
      width="500"
      height="500"
      crossorigin="anonymous"
      preload
    />

    <h1>Picture preload with crossorigin in img-attrs</h1>
    <nuxt-picture
      src="/images/everest.jpg"
      width="500"
      height="500"
      :img-attrs="{ crossorigin: 'anonymous' }"
      preload
    />

    <h1>Picture preload with camel-cased crossorigin in img-attrs</h1>
    <nuxt-picture
      src="/images/nuxt.png"
      width="500"
      height="500"
      :img-attrs="camelCrossOrigin"
      preload
    />
  </div>
</template>
