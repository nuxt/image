<template>
  <div>
    <div class="container">
      <h2>Playground</h2>
      <ul>
        <li>
          <code>src</code>
          <select v-model="src">
            <option v-for="src of sources" :key="src" :value="src">
              {{ src }}
            </option>
          </select>
        </li>
      </ul>
      <NuxtImg ref="nuxtImg" :src="src" width="200" height="auto" quality="1" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sources: [
        '/images/damavand.jpg',
        '/images/everest.jpg'
      ],
      src: '/images/damavand.jpg',
      originalSize: ''
    }
  },
  watch: {
    src: {
      immediate: true,
      async handler (src) {
        const { width, height } = await this.$img.getResolution(this.src)
      }
    }
  },
  mounted () {
    this.nuxtImgCode = this.$refs.nuxtImg.$el.outerHTML
  }
}
</script>

<style scoped>
.container {
  text-align: center;
}
.container img {
  max-width: 720px;
  margin: 10px;
  border: 2px white solid;
  border-radius: 3px;
}
</style>
