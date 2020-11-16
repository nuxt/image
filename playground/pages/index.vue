<template>
  <div>
    <div class="container">
      <h2>SVG image inside project</h2>
      <NuxtImg src="images/nuxt-white.svg" width="400" height="400" />

      <h2>JPEG image inside project</h2>
      <NuxtImg src="/images/damavand.jpg" />

      <h2>JPEG image from remote url</h2>
      <NuxtImg src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Aconcagua2016.jpg/600px-Aconcagua2016.jpg" />

      <h2>PNG image on Cloudinary</h2>
      <NuxtImg src="cloudinary:/remote/nuxt-org/blog/going-full-static/main.png" />

      <h2>JPEG image on Fastly</h2>
      <NuxtImg src="fastly:/image.jpg" />
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
}
.container img {
  max-width: 720px;
  margin: 10px;
  border-radius: 3px;
}
</style>
