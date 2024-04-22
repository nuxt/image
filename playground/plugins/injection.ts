export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function typeTesting() {
    nuxtApp.$img.getImage('https://example.com/image.jpg')
    // @ts-expect-error unknown property on nuxt app
    nuxtApp.$imga.getImage('https://example.com/image.jpg')
  }
})
