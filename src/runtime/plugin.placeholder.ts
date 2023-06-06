import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const $img = () => throwImgError()
  $img.getImage = () => throwImgError()
  $img.getSizes = () => throwImgError()
  $img.getMeta = () => throwImgError()
  nuxtApp.provide('img', $img)
})

function throwImgError () {
  throw new Error('[nuxt] [image] `$img` global utility is not enabled. You can enable it by setting `image: { inject: true }` in `nuxt.config`.')
}
