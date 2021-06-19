// https://glide.thephpleague.com/2.0/api/quick-reference/

import { ProviderGetImage } from 'src'
import { joinURL, encodeQueryItem, encodePath, hasProtocol } from 'ufo'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'fm',
    fit: 'fit',
    width: 'w',
    height: 'h',
    quality: 'q',
    background: 'bg'
  },
  joinWith: '&',
  formatter: (key, val) => encodeQueryItem(key, val)
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const params = operationsGenerator(modifiers)

  return {
    url: joinURL(baseURL, encodePath(src) + (params ? '?' + params : ''))
  }
}
