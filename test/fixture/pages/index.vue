<template>
  <div>
    It works
    <nuxt-img :src="image" width="300" height="200" @load="onLoad" />
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
    },
    onLoad () {
      console.log('Image was loaded.')
    }
  }
}
</script>
