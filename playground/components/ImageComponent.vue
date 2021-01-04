<template>
  <nuxt-image
    :src="src"
    :format="format"
    :alt="alt"
    class="image"
    sets="320"
  />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default () {
        return ''
      }
    },

    format: {
      type: String,
      default () {
        return ''
      }
    },

    alt: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>
