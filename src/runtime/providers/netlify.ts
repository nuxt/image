import { getImage as largeMediaGetImage, operationsGenerator as largeMediaOptionsGenerator } from './netlifyLargeMedia'
import { getImage as cdnGetImage, operationsGenerator as cdnOptionsGenerator } from './netlifyImageCdn'

// If the site has the deprecated Netlify Large Media enabled we will use the old
// Large Media adapter. Otherwise, we will use the Netlify Image CDN
const hasLargeMedia = Boolean(process.env.NETLIFY_LFS_ORIGIN_URL)

export const getImage = hasLargeMedia ? largeMediaGetImage : cdnGetImage
export const operationsGenerator = hasLargeMedia ? largeMediaOptionsGenerator : cdnOptionsGenerator
