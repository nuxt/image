import { defineProvider } from '#image'

export default defineProvider({
  getImage: url => ({ url }),
})
