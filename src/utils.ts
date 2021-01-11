import consola from 'consola'
import hasha from 'hasha/index.js'
import { name, version } from '../package.json'

export const logger = consola.withScope('@nuxt/image')

export const pkg = { name, version }

export function hash (value: string, length = 6) {
  return hasha(value).substr(0, length)
}

// TODO: Typechecks
export function pick (obj: any, keys: string[]) {
  const newobj = {}
  for (const key of keys) {
    newobj[key] = obj[key]
  }
  return newobj
}
