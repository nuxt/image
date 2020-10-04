<template>
  <div>
    It works
    <nuxt-image :src="image" width="300px" height="200px" />
    <button id="button" @click="changeImage">
      Change Image
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      image: '/2000px-Aconcagua2016.jpg'
    }
  },
  methods: {
    changeImage () {
      this.image = '/1280px-K2_2006b.jpg'
    }
  }
}
</script>
