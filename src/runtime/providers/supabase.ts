import { joinURL, encodeQueryItem } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'width',
    height: 'height',
    fit: 'resize'
  },
  valueMap: {
    fit: {
      cover: 'cover',
      contain: 'contain',
      fill: 'fill'
    }
  },
  joinWith: ',',
  formatter: (key, val) => encodeQueryItem(key, val)
})

const defaultModifiers = {}

const isDev = process.env.NODE_ENV === 'development'

// https://supabase.com/blog/storage-image-resizing-smart-cdn
export const getImage: ProviderGetImage = (src, {
  modifiers = {},
  baseURL = '/'
} = {}) => {
  if (modifiers.format) {
    // Not currently supported
    if (isDev) {
      // eslint-disable-next-line
      console.warn(`Delete format is not supported in this provider. Warning originated from \`${src}\`.`)
    }
    delete modifiers.format
  }
  const mergeModifiers = { ...defaultModifiers, ...modifiers }
  const operations = operationsGenerator(mergeModifiers as any)
  // GET https://project_id.supabase.co/storage/v1/render/image/public/bucket/image.jpg?width=500&height=600
  // https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
  const url = operations ? joinURL(baseURL, 'cdn-cgi/image', operations, src) : joinURL(baseURL, src)

  return {
    url
  }
}
