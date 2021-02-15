<template>
  <div class="container">
    <!-- <h2>nuxt-img</h2>
    <NuxtImg
      :sizes="{ sm: 100, md: 500 }"
      src="/images/damavand.jpg"
    />

    <h2>nuxt-picture</h2>
    <NuxtPicture
      :sizes="{ sm: 100, md: 500 }"
      src="/images/damavand.jpg"
    /> -->
    <div style="width: 50vw">
      i'm 50vw
    </div>
    <nuxt-img
      src="/logos/nuxt.png"
      sizes="sm:100vw md:50vw lg:400px"
      loading="lazy"
    />
    <br>
    <nuxt-picture
      src="/logos/nuxt.png"
      sizes="sm:100vw md:50vw lg:400px"
      loading="lazy"
    />
  </div>
</template>

<script>
export default {
  methods: {
    l (txt) {
      return 'https://textoverimage.moesif.com/image?image_url=https%3A%2F%2Fraw.githubusercontent.com%2Fnuxt%2Fnuxt.js%2Fdev%2F.github%2Fnuxt.png&text=' + txt
    }
  }
}
</script>

<style scoped>
@media (max-width: 640px) {
  img2 {
    max-width: 100vw;
    width: 100vw;
  }
}

@media (max-width: 768px) {
  img2 {
    max-width: 50vw;
    width: 50vw;
  }
}

img2 {
  max-width: 300px;
  width: 300px;
}
</style>
