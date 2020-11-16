<template>
  <div class="container">
    <h2>Local SVG image</h2>
    <NuxtImg layout="responsive" src="images/nuxt-white.svg" />

    <h2>Local JPEG image</h2>
    <NuxtImg layout="responsive" src="/images/damavand.jpg" />

    <h2>JPEG image from remote url</h2>
    <NuxtImg layout="responsive" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Aconcagua2016.jpg/600px-Aconcagua2016.jpg" />

    <h2>PNG image on Cloudinary</h2>
    <NuxtImg layout="responsive" src="cloudinary:/remote/nuxt-org/blog/going-full-static/main.png" />

    <h2>JPEG image on Fastly</h2>
    <NuxtImg layout="responsive" src="fastly:/image.jpg" />
  </div>
</template>
