<template>
  <div class="container">
    <div
      v-for="(image, i) in [...images, ...images, ...images, ...images, ...images]"
      :key="'img-' + i"
      class="image"
    >
      <nuxt-image
        :src="image.src"
        :alt="image.alt"
        fit="contain"
        :placeholder="image.placeholder !== false"
        sizes="320"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.container .image {
  width: 320px;
  margin: 10px;
  border-radius: 3px;
}
</style>

<script>
export default {
  asyncData () {
    return {
      images: [
        { src: 'images/nuxt-white.svg', alt: 'Nuxt', placeholder: false },
        { src: 'cloudinary:/remote/nuxt-org/blog/going-full-static/main.png', alt: 'Cloudinary' },
        { src: 'fastly:/imsage.jpg', alt: 'fastify' },
        { src: 'imgix:/examples/bluehat.jpg', alt: 'imgix' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Aconcagua2016.jpg/600px-Aconcagua2016.jpg', alt: 'Aconcagua Argentina' },
        { src: '/images/2000px-Everest_kalapatthar.jpg', alt: 'Mount Everest Nepal' },
        { src: '/images/2000px-Mont-Blanc_from_Planpraz_station.jpg', alt: 'Mount Kilimanjaro Tanzania' },
        { src: '/images/2000px-Mount_Vinson_from_NW_at_Vinson_Plateau_by_Christian_Stangl.jpg', alt: 'Vinson Massif Antarctic' },
        { src: '/images/2000px-Wonder_Lake_and_Denali.jpg', alt: 'Denali Alaska' },
        { src: '/images/1280px-K2_2006b.jpg', alt: 'K2' },
        { src: '/images/damavand.jpg', alt: 'Damavand' },
        { src: '/images/1280px-ChoOyu-fromGokyo.jpg', alt: 'Cho Oyu' }
      ]
    }
  }
}
</script>
