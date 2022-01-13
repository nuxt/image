<template>
  <div>
    <nuxt-img src="/images/colors.jpg" width="500" height="500" @load="isLoaded = true" />
    <p>Received onLoad event: {{ isLoaded }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      isLoaded: false
    }
  }
})
</script>
