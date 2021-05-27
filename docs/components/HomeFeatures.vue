<template>
  <div
    class="
      mx-auto
      px-4
      py-16
      sm:px-6
      sm:pt-20
      sm:pb-24
      lg:pt-24
      lg:px-8
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

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const features = [
      {
        title: 'Resize and manipulate',
        description:
          'Generate images at the right size, defined in your components or following your breakpoints. Change the format and quality of your images.',
        icon: 'IconInbox'
      },
      {
        title: 'Image providers',
        description:
          'Use your favorite image providers with ease or use the built-in one. Imgix, Cloudinary, Prismic, Twicpics, Vercel and more are supported by default.',
        icon: 'IconUsers'
      },
      {
        title: 'Standard compliant',
        description:
          'Our components generates standard &lt;img&gt; and &lt;picture&gt; tags. No tricky wrapper so you can style your images with confidence.',
        icon: 'IconTrash'
      }
    ]

    return {
      features
    }
  }
})
</script>
