<template>
  <div>
    <div class="bg" :style="bgStyle" />
    <div class="container">
      <client-only>
        <dat-gui close-text="Close controls" open-text="Open controls" close-position="bottom">
          <dat-folder label="Source">
            <dat-select v-model="src" :items="sources" label="Picture" />
            <dat-select v-model="format" :items="formats" label="Format" />
          </dat-folder>
          <dat-folder label="Width">
            <dat-boolean v-model="widthAuto" label="Auto" />
            <dat-number
              v-if="!widthAuto"
              v-model="width"
              :step="10"
              :min="10"
              :max="1000"
              label="Width"
            />
          </dat-folder>
          <dat-folder label="Height">
            <dat-boolean v-model="heightAuto" label="Auto" />
            <dat-number
              v-if="!heightAuto"
              v-model="height"
              :step="10"
              :min="10"
              :max="1000"
              label="Height"
            />
          </dat-folder>
          <dat-folder label="Operations">
            <dat-select v-if="!widthAuto && !heightAuto" v-model="fit" :items="fits" label="Fit" />
            <dat-color v-if="!widthAuto && !heightAuto" v-model="background" label="Background" />
            <dat-number
              v-if="!isSvg"
              v-model.lazy="quality"
              :step="5"
              :min="5"
              :max="100"
              label="Quality"
            />
          </dat-folder>
          <dat-folder label="UI">
            <dat-boolean v-model="showBorder" label="Image border" />
            <dat-boolean v-if="!isSvg" v-model="showBg" label="Background" />
          </dat-folder>
          <!-- <dat-string v-model="title" label="Title" />
          <dat-button label="Trigger alert" @click="triggerAlert" />
          <dat-folder label="Picture">
            <dat-select v-model="pictureUrl" :items="pictures" label="Picture" />
            <dat-boolean v-model="showPicture" label="Show Picture" />
            <dat-number v-model="boxShadow.offsetX" :min="-100" :max="100" :step="1" label="Offset X" />
            <dat-number v-model="boxShadow.offsetY" :min="-100" :max="100" :step="1" label="Offset Y" />
            <dat-number v-model="boxShadow.blurRadius" :min="0" :max="100" :step="1" label="Blur radius" />
            <dat-number v-model="boxShadow.spreadRadius" label="Spread radius" />
          </dat-folder> -->
        </dat-gui>
      </client-only>

      <NuxtImg
        ref="nuxtImg"
        :src="src"
        :width="widthAuto ? 'auto' : width"
        :height="heightAuto ? 'auto' : height"
        :fit="fit"
        :quality="quality"
        :format="format"
        :background="background"
        :class="{ border: showBorder }"
      />

      <p class="credits" v-html="imageCredits" />
      <!-- <NuxtImg
        ref="nuxtImg"
        :src="src"
        width="200"
        ratio="auto" // check image original size and specify width and height
        :ratio="3/1" // you need to specify width or height
        fill="crop"
        loading="eager"
        quality="100"
      /> -->
      <!-- <NuxtImg
        ref="nuxtImg"
        :src="src"
        width="200"
        :ratio="2/1" // set height="100"
        ratio="auto" // detect and fill the height bases on image resolution (ssr = image, csr = element size after mounted using an empty src)
        loading="eager"
        quality="100"
      /> -->

      <!-- // Detecting image ratio based on CSS computed values, to avoid image fetch -> placeholder image
      // Let image render with no src

      // What about loading="lazy"?
      // On ssr do we render placeholder? no src? what about SEO?
      // -> No loading="lazy" on NuxtImg except supported browsers -->
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sources: [
        { name: 'colors.jpg', value: '/images/colors.jpg', credits: '<span>Photo by <a href="https://unsplash.com/@jeremythomasphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Jeremy Thomas</a> on <a href="https://unsplash.com/s/photos/colors?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>.' },
        { name: 'everest.jpg', value: '/images/everest.jpg', credits: 'Photo from the <a href="https://en.wikipedia.org/wiki/Mount_Everest">Mount Everest</a>\'s Wikipedia page.' },
        { name: 'tacos.svg', value: '/images/tacos.svg', credits: 'Illustration from <a href="https://icons8.com/illustrations/illustration/abstract-1419">Icons8</a>' },
        { name: 'Unplash Image', value: 'https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1940&q=80', credits: '<span>Photo by <a href="https://unsplash.com/@omidarmin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Omid Armin</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>' }
      ],
      fits: [
        { name: 'cover', value: 'cover' },
        { name: 'contain', value: 'contain' },
        { name: 'fill', value: 'fill' },
        { name: 'inside', value: 'inside' },
        { name: 'outside', value: 'outside' }
      ],
      formats: [
        { name: 'auto', value: '' },
        { name: 'webp', value: 'webp' },
        { name: 'jpg', value: 'jpg' },
        { name: 'png', value: 'png' },
        { name: 'svg', value: 'svg' },
        { name: 'gif', value: 'gif' }
      ],
      src: '/images/colors.jpg',
      fit: 'cover',
      format: '',
      quality: 100,
      widthAuto: true,
      heightAuto: false,
      width: 400,
      height: 200,
      showBorder: true,
      background: '#000000',
      showBg: true
    }
  },
  computed: {
    isSvg () {
      return this.src.endsWith('.svg')
    },
    imageCredits () {
      const source = this.sources.find(({ value }) => value === this.src)
      return source ? source.credits : ''
    },
    bgSrc () {
      return this.$img(this.src, {
        width: 30,
        format: 'jpg'
      }).url
    },
    bgStyle () {
      return {
        backgroundImage: this.showBg && !this.isSvg ? `url(${this.bgSrc})` : 'none'
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  opacity: 0.5;
  filter: blur(8px);
}
img {
  max-width: 100%;
  max-height: 100%;
  transition: all 200ms ease-in-out;
}
img.border {
  border: 2px white solid;
  border-radius: 5px;
}
.credits {
  position: absolute;
  bottom: 0;
  color: #AAAAAA;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background: rgba(0, 0, 0, 0.6);
  margin: 0;
  padding: 8px 12px;
  transition: background 200ms ease-in-out;
}
.credits:hover {
  background: rgba(0, 0, 0, 0.8);
}
.credits >>> a {
  color: #CCCCCC;
  text-decoration: underline;
}
.credits >>> a:hover {
  color: #EEEEEE;
  text-decoration: underline;
}
</style>
