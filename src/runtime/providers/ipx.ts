import { joinURL, encodePath, encodeParam } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

import type { HTTPStorageOptions, NodeFSSOptions, IPXOptions as CoreIPXOptions, IPXModifiers } from 'ipx'

export type { IPXModifiers }

export interface IPXRuntimeConfig extends Omit<CoreIPXOptions, 'storage' | 'httpStorage'> {
  http: HTTPStorageOptions
  fs: NodeFSSOptions
  baseURL: string
}

export interface IPXOptions extends Omit<IPXRuntimeConfig, 'alias'> {
  modifiers: Partial<IPXModifiers>
}

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'f',
    width: 'w',
    height: 'h',
    resize: 's',
    quality: 'q',
    background: 'b',
    position: 'pos',
  },
  formatter: (key, val: string | number | boolean) => encodeParam(key) + '_' + encodeParam(val.toString()),
})

export default defineProvider<Partial<IPXOptions>>({
  validateDomains: true,
  supportsAlias: true,
  getImage: (src, { modifiers, baseURL }, ctx) => {
    if (modifiers.width && modifiers.height) {
      modifiers.resize = `${modifiers.width}x${modifiers.height}`
      delete modifiers.width
      delete modifiers.height
    }

    const params = operationsGenerator(modifiers) || '_'

    if (!baseURL) {
      baseURL = joinURL(ctx.options.nuxt.baseURL, '/_ipx')
    }

    return {
      url: joinURL(baseURL, params, encodePath(src)),
    }
  },
})
