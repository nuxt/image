import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

// https://docs.netlify.com/image-cdn/overview/
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    format: 'fm',
    quality: 'q',
    position: 'position',
    fit: 'fit',
  },
  valueMap: {
    fit: {
      fill: 'fill',
      cover: 'cover',
      contain: 'contain',
    },
    format: {
      avif: 'avif',
      gif: 'gif',
      jpg: 'jpg',
      jpeg: 'jpg',
      png: 'png',
      webp: 'webp',
    },
    position: {
      top: 'top',
      right: 'right',
      bottom: 'bottom',
      left: 'left',
      center: 'center',
    },
  },
})

interface NetlifyImageCDNOptions {
  baseURL: string
}

export default defineProvider<NetlifyImageCDNOptions>({
  getImage: (src, { modifiers, baseURL }) => {
    const operations = operationsGenerator({ ...modifiers, url: src })
    return {
      url: `${baseURL || '/.netlify/images'}?${operations}`,
    }
  },
})
