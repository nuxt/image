import { constructCloudinaryUrl } from '@cloudinary-util/url-loader'
import type { ProviderGetImage } from '../../types'

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  return {
    url: constructCloudinaryUrl({
      options: {
        src: src.includes('//') ? src.substring(1) : src,
        ...modifiers
      },
      config: {
        cloud: {
          cloudName: baseURL.replace('https://res.cloudinary.com/', '').split('/')[0]
        }
      }
    })
  }
}
