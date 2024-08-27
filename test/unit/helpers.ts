import { vi } from 'vitest'

export const getImageLoad = (cb = () => {}) => {
  let resolve = () => {}
  let image = {} as HTMLImageElement
  const loadEvent = Symbol('loadEvent')
  const ImageMock = vi.fn(() => {
    const _image = {
      onload: () => {},
    } as unknown as HTMLImageElement
    image = _image
    // @ts-expect-error not valid argument for onload
    resolve = () => _image.onload?.(loadEvent)

    return _image
  })

  vi.stubGlobal('Image', ImageMock)
  cb()
  vi.unstubAllGlobals()

  return {
    resolve,
    image,
    loadEvent,
  }
}
