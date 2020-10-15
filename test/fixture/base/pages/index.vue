<template>
  <div>
    It works
    <nuxt-image :src="image" />
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
