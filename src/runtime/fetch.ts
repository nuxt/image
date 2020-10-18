import { cleanDoubleSlashes } from './utils'

export default function imageFetch (url: string) {
  return fetch(cleanDoubleSlashes(url))
}
