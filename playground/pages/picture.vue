<template>
  <div>
    <div>
      <select v-model="src">
        <option value="/images/damavand.jpg">
          Damavand
        </option>
        <option value="/images/colors.jpg">
          Colors
        </option>
      </select>
      <!-- <h2>SVG image inside project</h2>
      <NuxtPicture :loading="true" src="/images/nuxt-white.svg" width="40" height="40" /> -->
      <!-- <NuxtPicture placeholder src="/images/nuxt-white.svg" width="40" height="40" /> -->

      <h2>JPEG image inside project</h2>
      <NuxtPicture placeholder :src="src" />
      <!-- <div style="height: 2000px;" /> -->
      <h2>JPEG image from remote url</h2>
      <!-- <NuxtPicture placeholder width="600" height="331" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Aconcagua2016.jpg/600px-Aconcagua2016.jpg" /> -->

      <!-- <h2>PNG image on Cloudinary</h2>
      <NuxtPicture width="800" height="200" placeholder provider="cloudinary" src="/remote/nuxt-org/blog/going-full-static/main" />

      <h2>JPEG image on TwicPics</h2>
      <NuxtPicture width="900" placeholder provider="twicpics" src="/football.jpg" />

      <h2>JPEG image on Fastly</h2>
      <NuxtPicture width="900" placeholder provider="fastly" src="/image.jpg" /> -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      src: '/images/damavand.jpg'
    }
  }
}
</script>

<style scoped>
.container {
  text-align: center;
  max-width: 720px;
  margin: auto;
}
</style>
