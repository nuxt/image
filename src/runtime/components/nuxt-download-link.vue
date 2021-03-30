<template>
  <a :key="nSrc" :href="nSrc">
    <slot>{{ nSrc }}</slot>
  </a>
</template>

<script lang="ts">
import { imageMixin } from './image.mixin'

export default {
  name: 'NuxtDownloadLink',
  mixins: [imageMixin],
  computed: {
    nSrc (): string {
      return this.$img(this.src, this.nModifiers, this.nOptions)
    }
  }
}
</script>
