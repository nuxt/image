<template>
  <div class="flex flex-col">
    <div class="container mx-auto flex items-center py-32 flex-wrap">
        <nuxt-image
          v-for="image in images"
          :key="image.src"
          :src="image.src"
          :alt="image.alt"
          height="67%"
          sets="640"
          class="w-1/2"
        />
      </div>
  </div>
</template>

<script>
export default {
  asyncData() {
    return {
      images: [
        {
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Aconcagua2016.jpg/600px-Aconcagua2016.jpg",
          alt: "Aconcagua Argentina"
        },
        {
          src: "/images/2000px-Everest_kalapatthar.jpg",
          alt: "Mount Everest Nepal"
        },
        {
          src: "/images/2000px-Mont-Blanc_from_Planpraz_station.jpg",
          alt: "Mount Kilimanjaro Tanzania"
        },
        {
          src: "/images/2000px-Mount_Vinson_from_NW_at_Vinson_Plateau_by_Christian_Stangl.jpg",
          alt: "Vinson Massif Antarctic"
        },
        {
          src: "/images/2000px-Wonder_Lake_and_Denali.jpg",
          alt: "Denali Alaska"
        }
      ]
    }
  }
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