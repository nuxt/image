import { joinURL } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    quality: 'q',
  },
})

export default defineProvider({
  getImage: (src, { modifiers }) => {
    const operations = operationsGenerator(modifiers)
    return {
      url: joinURL(src + (operations ? ('?' + operations) : '')),
    }
  },
})
