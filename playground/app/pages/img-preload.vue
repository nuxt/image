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

    <h1>Picture preload with crossorigin prop</h1>
    <nuxt-picture
      src="/images/colors-picture-with-crossorigin-prop.jpg"
      width="500"
      height="500"
      crossorigin="anonymous"
      preload
    />

    <h1>Picture preload with crossorigin in imgAttrs</h1>
    <nuxt-picture
      src="/images/colors-picture-with-crossorigin-img-attrs.jpg"
      width="500"
      height="500"
      :img-attrs="{ crossorigin: 'use-credentials' }"
      preload
    />
  </div>
</template>
