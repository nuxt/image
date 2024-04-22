import { joinURL } from 'ufo'

import type { ImageOptions, ResolvedImage, ImageCTX } from '../../../types'

import { formatter } from './formatter'
import { keyMap } from './keyMap'
import { valueMap } from './valueMap'

import { createOperationsGenerator } from '#image'

interface PreprImageOptions extends ImageOptions {
  projectName: string
}

type PreprProviderGetImage = (src: string, options: PreprImageOptions, ctx: ImageCTX) => ResolvedImage

const operationsGenerator = createOperationsGenerator({
  formatter,
  joinWith: ',',
  keyMap,
  valueMap,
})

const getImage: PreprProviderGetImage = (src, options, _ctx) => {
  const { projectName } = options

  if (typeof projectName !== 'string' || !projectName.trim()) {
    throw new TypeError('[nuxt] [image] [prepr] No project name provided.')
  }

  const fileBucket = 'stream'
  const fileOperations = operationsGenerator(options.modifiers)
  const filePath = fileOperations ? joinURL(fileOperations, src) : src

  const projectUrl = `https://${projectName.trim()}.${fileBucket}.prepr.io`

  return {
    url: joinURL(projectUrl, filePath),
  }
}

export { getImage }
