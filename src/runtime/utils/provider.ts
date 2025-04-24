import type { ImageProvider } from '../../module'

export function defineProvider<T>(setup: ImageProvider<T> | (() => ImageProvider<T>)): () => ImageProvider<T> {
  let result: ImageProvider<T>

  return () => {
    if (result) {
      return result
    }
    result = typeof setup === 'function' ? setup() : setup
    return result
  }
}
