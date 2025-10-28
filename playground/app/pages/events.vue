<template>
  <div>
    <h1>Original</h1>
    <nuxt-img
      src="/images/colors.jpg"
      width="500"
      height="500"
      @load="() => { console.log('Image was loaded') }"
    />
    <nuxt-picture
      src="/images/colors.jpg"
      width="500"
      height="500"
      @load="() => { console.log('Image was loaded') }"
    />

    <h1>Placeholder</h1>
    <nuxt-img
      :src="src"
      placeholder
      width="500"
      height="500"
      @load="() => { console.log('Image was loaded') }"
    />
    <nuxt-picture
      :src="src"
      placeholder
      width="500"
      height="500"
      @load="() => { console.log('Image was loaded') }"
    />

    <h1>404</h1>
    <nuxt-img
      :src="'nonexistent' + src"
      width="500"
      height="500"
      @error="() => { console.log('Error loading image') }"
    />
    <nuxt-picture
      :src="'nonexistent' + src"
      width="500"
      height="500"
      @error="() => { console.log('Error loading image') }"
    />
  </div>
</template>

<script setup lang="ts">
const src = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
</script>
