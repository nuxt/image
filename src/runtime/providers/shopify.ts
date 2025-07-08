import { joinURL, withBase } from 'ufo'
import { defineProvider, createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'width',
    height: 'height',
    format: 'format',
    quality: 'quality',
    padColor: 'pad_color',
    crop: 'crop',
    cropLeft: 'crop_left',
    cropTop: 'crop_top',
    cropWidth: 'crop_width',
    cropHeight: 'crop_height',
  },
  valueMap: {
    crop: {
      center: 'center',
      top: 'top',
      bottom: 'bottom',
      left: 'left',
      right: 'right',
      region: 'region',
    },
  },
})

interface ShopifyOptions {
  baseURL: string
}

export default defineProvider<ShopifyOptions>({
  getImage: (src, { modifiers, baseURL = '' }) => {
    const operations = operationsGenerator(modifiers)

    return {
      url: withBase(joinURL(src + (operations ? ('?' + operations) : '')), baseURL),
    }
  },
})
