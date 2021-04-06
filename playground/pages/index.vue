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

      <h2>JPEG image on Storyblok</h2>
      <h3>Resizing</h3>
      <div class="flex">
        <div>Original</div>
        <NuxtImg
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
        />
      </div>
      <div class="flex">
        <div>Resized static</div>
        <NuxtImg
          width="500"
          height="500"
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
        />
      </div>
      <div class="flex">
        <div>Proportional to Width</div>
        <NuxtImg
          width="500"
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
        />
      </div>
      <div class="flex">
        <div>Proportional to Height</div>
        <NuxtImg
          height="500"
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
        />
      </div>
      <h3>Fit-in</h3>
      <div class="flex">
        <div>Fit in with background CCCCCC</div>
        <NuxtImg
          width="200"
          height="200"
          fit="in"
          :modifiers="{ filters: { fill: 'CCCCCC' } }"
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
        />
      </div>
      <h3>Format</h3>
      <div class="flex">
        <div>Change image format</div>
        <NuxtImg
          width="200"
          format="webp"
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
        />
      </div>
      <h3>Quality</h3>
      <div class="flex">
        <div>Resized and 10% Quality</div>
        <NuxtImg
          width="200"
          quality="10"
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
        />
      </div>
      <h3>Facial detection</h3>
      <div class="flex">
        <div>Resized without Smart Crop</div>
        <NuxtImg
          width="600"
          height="130"
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg"
        />
      </div>
      <div class="flex">
        <div>Resized with Smart Crop</div>
        <NuxtImg
          width="600"
          height="130"
          :modifiers="{ smart: true }"
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg"
        />
      </div>
      <h3>Custom focal point</h3>
      <div class="flex">
        <div>Focus on the bottom of the image</div>
        <NuxtImg
          width="600"
          height="130"
          :modifiers="{ filters: { focal: '450x500:550x600' } }"
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/1000x600/d962430746/demo-image-human.jpeg"
        />
      </div>
      <div class="flex">
        <div>Focus on the top of the image</div>
        <NuxtImg
          width="600"
          height="130"
          :modifiers="{ filters: { focal: '450x0:550x100' } }"
          provider="storyblok"
          src="https://a.storyblok.com/f/39898/1000x600/d962430746/demo-image-human.jpeg"
        />
      </div>
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
