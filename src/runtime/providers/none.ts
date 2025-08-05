import { defineProvider } from '../utils/provider'

export default defineProvider({
  getImage: url => ({ url }),
})
