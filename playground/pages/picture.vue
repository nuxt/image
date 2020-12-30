<template>
  <div>
    <div class="container">
      <h2>SVG image inside project</h2>
      <NuxtPicture :lazy="false" src="images/nuxt-white.svg" width="400" height="400" />

      <h2>JPEG image inside project</h2>
      <NuxtPicture width="400" placeholder src="/images/damavand.jpg" />

      <h2>JPEG image from remote url</h2>
      <NuxtPicture placeholder src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Aconcagua2016.jpg/600px-Aconcagua2016.jpg" />

      <h2>PNG image on Cloudinary</h2>
      <NuxtPicture width="800" placeholder provider="cloudinary" src="/remote/nuxt-org/blog/going-full-static/main" />

      <h2>JPEG image on TwicPics</h2>
      <NuxtPicture width="900" placeholder provider="twicpics" src="/football.jpg" />

      <h2>JPEG image on Fastly</h2>
      <NuxtPicture width="900" placeholder provider="fastly" src="/image.jpg" />

      <h2>JPEG image on Storyblok</h2>
      <NuxtPicture width="900" placeholder provider="storyblok" src="https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg" />
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
