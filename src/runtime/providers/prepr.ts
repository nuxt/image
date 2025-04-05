import { joinURL } from 'ufo'

import { defineProvider } from '../provider'

import { createOperationsGenerator } from '#image'

interface PreprImageOptions {
  projectName: string
}

/**
 * Key map is responsible for mapping readable "properties", which can be passed
 * as modifiers of `NuxtImg` component, to URL path parameters that can be
 * interpreted Prepr's REST API.
 */
const keyMap = {
  crop: 'c',
  format: 'format',
  height: 'h',
  quality: 'q',
  width: 'w',
} as const

/**
 * Value map is responsible for mapping readable "properties" defined in
 * `keyMap.ts` aswell as native modifiers of `NuxtImg` component, to URL path
 * parameter values that can be interpreted Prepr's REST API.
 *
 * ```Examples
 * Prepr's `w` path param expects an arbitrary number, so, it does not need to be in `valueMap`
 *
 * Our custom param `width` maps to `w` in keyMap, so, it does not need to be in `valueMap`
 *
 * Prepr's `format` path param expects a string which can either be `jpg` or `png`,
 * if we want to allow the user to pass <NuxtImage :modifiers="{ format: 'jpeg' }" />,
 * because it is a valid option of <NuxtImg :format />, then we need to have
 * `jpeg` to `jpg` because Prepr's API does not recognize `jpeg`. Similar things
 * could be said for `fit=cover`, which should map to `fit=crop`
 *```
 */
const valueMap = {
  format: {
    jpeg: 'jpg',
  },
  fit: {
    cover: 'crop', // Prepr.io accepts value `crop` defaulting to value `centre`
  },
} as const

export function formatter(key: string, value: string) {
  return String(value) === 'true' ? key : `${key}_${value}`
}

const operationsGenerator = createOperationsGenerator({
  formatter,
  joinWith: ',',
  keyMap,
  valueMap,
})

export default defineProvider<PreprImageOptions>({
  getImage: (src, options, _ctx) => {
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
  },
})
