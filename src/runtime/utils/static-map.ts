const staticImageMap = {}

function updateImageMap () {
  if (typeof window.$nuxt !== 'undefined') {
    const pageImages = (window.$nuxt as any)._pagePayload?.data?.[0]?._img || {}
    Object.assign(staticImageMap, pageImages)
    console.log(staticImageMap)
  }
}

export function useStaticImageMap (nuxtContext?) {
  // Update on initialization
  updateImageMap()

  // Merge new mappings on route change
  if (nuxtContext) {
    nuxtContext.app.router.afterEach(updateImageMap)
  }

  // Make sure manifest is initialized
  if ((window as any).onNuxtReady) {
    (window as any).onNuxtReady(updateImageMap)
  }

  return staticImageMap
}
