import { $Img } from './src/types'

declare global {
    // Convenience declaration to avoid importing types into runtime templates
    const $Img: $Img
}
