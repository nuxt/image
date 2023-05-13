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
  valueMap
})

const getImage: PreprProviderGetImage = (src, options, _ctx) => {
  const { projectName } = options

  if (typeof projectName !== 'string') {
    throw new TypeError('The ImageProvider \'prepr\' expects a string to be defined in your nuxt configuration at \'image.prepr.projectName\'')
  }

  const projectNameTrimmed = projectName.trim()

  if (projectNameTrimmed === '') {
    throw new Error('It appears your nuxt configuration includes an empty string at \'image.prepr.projectName\'')
  }

  const fileBucket = 'stream'
  const fileOperations = operationsGenerator(options.modifiers)
  const filePath = fileOperations ? `${fileOperations}/${src}` : src

  const projectUrl = `https://${projectNameTrimmed}.${fileBucket}.prepr.io`

  return {
    url: joinURL(projectUrl, filePath)
  }
}

export { getImage }
