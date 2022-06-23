<template>
  <div>
    <h1>Original</h1>
    <nuxt-img
      src="/images/colors.jpg"
      width="500"
      height="500"
      @load="isLoaded = true"
    />
    <p>Received onLoad event: {{ isLoaded }}</p>

    <h1>Placeholder</h1>
    <nuxt-img
      :src="src"
      placeholder
      width="500"
      height="500"
      @load="isLoaded = true"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      isLoaded: false,
      src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
    }
  }
})
</script>
