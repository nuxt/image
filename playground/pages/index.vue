<template>
  <div class="flex flex-col">
    <section>
      <nuxt-image
        src="/images/wolfgang-hasselmann-HQIcxyA4cYI-unsplash.jpg"
        class="background-image"
        sets="300,900:900,1280:1280"
      >
      </nuxt-image>
      <div class="copyright">
        <span>Photo by <a href="https://unsplash.com/@wolfgang_hasselmann?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Wolfgang Hasselmann</a> on <a href="https://unsplash.com/t/wallpapers?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
      </div>
    </section>
    <div class="container mx-auto flex items-center py-32 flex-wrap">
        <nuxt-image
          src="/images/wolfgang-hasselmann-esicdctFse0-unsplash.jpg"
          height="67%"
          sets="640"
          class="w-1/2"
        />

        <nuxt-image
          src="/images/max-harlynking-_c2on-QNXG0-unsplash.jpg"
          height="67%"
          sets="640"
          class="w-1/2"
        />
        
        <nuxt-image
          src="/images/andre-lergier-MMS_CBu0ngM-unsplash.jpg"
          sets="640"
          height="67%"
          class="w-1/2"
        />

        <nuxt-image
          src="/images/bela-bako-EMx_ih9FTwI-unsplash.jpg"
          sets="640"
          height="67%"
          class="w-1/2"
        />
        
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
body {
  margin: 0;
  a {
    color: inherit;
  }
}
section {
  position: relative;
  width: 100vw;
  height: 100vh;
  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
  .copyright {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 0.8em;
    color: white;
  }
}
</style>