import consola from 'consola'
import hasha from 'hasha/index.js'
import { name, version } from '../package.json'

export const logger = consola.withScope('@nuxt/image')

export const pkg = { name, version }

export function hash (value: string, length = 6) {
  return hasha(value).substr(0, length)
}

export function pick<O extends Record<any, any>, K extends keyof O> (obj: O, keys: K[]): Pick<O, K> {
  const newobj = {} as Pick<O, K>
  for (const key of keys) {
    newobj[key] = obj[key]
  }
  return newobj
}

export function guessExt (input: string = '') {
  if (input) {
    const ext = input.split(/[?#]/).shift()!.split('.').pop()
    if (ext && /^[\w0-9]+$/.test(ext)) {
      return '.' + ext
    }
  }
  return ''
}
