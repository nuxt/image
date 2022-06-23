<template>
  <div
    class="
      mx-auto
      max-w-full
      lg:max-w-8xl
      px-4
      sm:px-6
      lg:px-8
      py-16
      sm:pt-20
      sm:pb-24
      relative
    "
  >
    <div
      class="
        grid grid-cols-1
        gap-x-6 gap-y-12
        sm:grid-cols-2
        lg:grid-cols-3
        lg:gap-x-8 lg:gap-y-16
      "
    >
      <HomeFeature
        v-for="(feature, index) of features"
        :key="index"
        :feature="feature"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    title: 'Resize and transform',
    description:
      'Generate images at the right size, defined by component or following responsive breakpoints. Use modern formats and adjust quality of website images.',
    icon: 'IconResize'
  },
  {
    title: 'Image providers',
    description:
      'Choose from 10+ ready-to-use popular providers, add your own custom provider in a few lines of code - or use the default settings to generate automatically optimized static images.',
    icon: 'IconSparkles'
  },
  {
    title: 'Standards compliant',
    description:
      'Image components generate standard &lt;img&gt; and &lt;picture&gt; tags. No tricky wrapper so you can style your images with confidence.',
    icon: 'IconCollection'
  }
]
</script>
