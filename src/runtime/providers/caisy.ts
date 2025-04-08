import { joinURL } from 'ufo'
import { defineProvider, createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    quality: 'q',
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`,
})

export default defineProvider({
  getImage: (src, { modifiers }) => {
    const operations = operationsGenerator(modifiers)
    return {
      url: joinURL(src + (operations ? ('?' + operations) : '')),
    }
  },
})
