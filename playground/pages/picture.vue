<template>
  <div>
    <nuxt-picture
      src="/images/colors.jpg"
      width="500"
      height="500"
      format="avif,webp"
      @load="isLoaded = true"
    />
    <p>Received onLoad event: {{ isLoaded }}</p>
  </div>
</template>

<script lang="ts">
export default {
  data () {
    return {
      isLoaded: false
    }
  }
}
</script>
