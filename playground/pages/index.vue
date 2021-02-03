<template>
  <div>
    <div class="container">
      <h2>NuxtImg vs Img</h2>
      <pre>&lt;img src="/images/damavand.jpg" width="200" height="auto"&gt;</pre>

      <p>
        <select v-model="src">
          <option value="/images/damavand.jpg">
            Damavand
          </option>
          <option value="/images/colors.jpg">
            Colors
          </option>
        </select>
      </p>
      <div style="height:2000px;" />

      <NuxtImg
        ref="nuxtImg"
        :src="src"
        width="200"
        height="100"
        loading="lazy"
      />
      <img ref="img" src="/images/damavand.jpg" width="200" height="100" loading="lazy">
      <pre>{{ nuxtImgCode }}</pre>
      <h2>SVG image from remote url</h2>
      <NuxtImg src="https://nuxtjs.org/logos/nuxt.svg?foo=bar" width="400" height="400" />

      <h2>JPEG image inside project</h2>
      <NuxtImg responsive src="/images/damavand.jpg" />

      <h2>JPEG image from remote url</h2>
      <NuxtImg src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Aconcagua2016.jpg/600px-Aconcagua2016.jpg" />

      <h2>PNG image on Cloudinary</h2>
      <NuxtImg provider="cloudinary" src="/remote/nuxt-org/blog/going-full-static/main" />
      <NuxtImg provider="cloudinary" src="/remote/nuxt-org/blog/going-full-static/main" width="200" height="200" fit="cropping" />
      <NuxtImg
        provider="cloudinary"
        src="/remote/nuxt-org/blog/going-full-static/main"
        width="200"
        height="200"
        fit="thumbnail"
        :operations="{ roundCorner: 'max' }"
      />

      <h2>JPEG image on TwicPics</h2>
      <NuxtImg provider="twicpics" src="/football.jpg" />
      <NuxtImg
        provider="twicpics"
        src="/football.jpg"
        width="250"
        height="400"
        :operations="{ focus: 'auto' }"
      />
      <NuxtImg provider="twicpics" src="/football.jpg" width="100" height="100" quality="1" />

      <h2>JPEG image on Fastly</h2>
      <NuxtImg provider="fastly" src="/image.jpg" />

      <h2>JPEG image on Imagekit</h2>
      <NuxtImg provider="imagekit" src="/img/plant.jpeg" />
      </p<select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nuxtImgCode: '',
      src: '/images/damavand.jpg'
    }
  },
  mounted () {
    // this.nuxtImgCode = this.$refs.nuxtImg.$el.outerHTML
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
