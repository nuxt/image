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

    <div style="width: 50vw; background-color: red">
      i'm 50vw
    </div>
    <nuxt-img
      src="/logos/nuxt.png"
      sizes="sm:100vw md:50vw lg:400px"
      placeholder
      class="responsive-placeholder-img"
    />
  </div>
</template>

<style scoped>
.responsive-placeholder-img {
  width: 400px
}

@media (max-width: 768px) {
  img2 {
    max-width: 50vw;
    width: 50vw;
  }
  .responsive-placeholder-img {
    width: 50vw;
  }
}

@media (max-width: 640px) {
  img2 {
    max-width: 100vw;
    width: 100vw;
  }
  .responsive-placeholder-img {
    width: 100vw;
  }
}

img2 {
  max-width: 300px;
  width: 300px;
}
</style>
