import { joinURL } from 'ufo'
import { NuxtAppOptions } from '@nuxt/types'

export const getImage: NuxtAppOptions['getImage'] = (
  src,
  { modifiers = {}, baseURL = '/' } = {}
) => {
  const operationsString = `w_${modifiers.width}&h_${modifiers.height}`

  return {
    url: joinURL(baseURL, operationsString, src)
  }
}
