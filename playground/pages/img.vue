<template>
  <div>
    <h1>Original</h1>
    <nuxt-img
      src="/images/colors.jpg"
      width="50"
      densities="1x 2x"
      @load="isLoaded = true"
    />
  </div>
</template>

<script lang="ts">
export default {
  data () {
    return {
      isLoaded: false,
      src:
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
    }
  }
}
</script>
