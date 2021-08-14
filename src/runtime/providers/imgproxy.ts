import { joinURL, withBase } from 'ufo'
import createHmac from 'create-hmac'
import type { ProviderGetImage } from 'src'
import defu from 'defu'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    resize: 'rs',
    size: 's',
    fit: 'rt',
    width: 'w',
    height: 'h',
    dpr: 'dpr',
    enlarge: 'el',
    extend: 'ex',
    gravity: 'g',
    crop: 'c',
    padding: 'pd',
    trim: 't',
    rotate: 'rot',
    quality: 'q',
    maxBytes: 'mb',
    background: 'bg',
    backgroundAlpha: 'bga',
    blur: 'bl',
    sharpen: 'sh',
    watermark: 'wm',
    preset: 'pr',
    cacheBuster: 'cb',
    stripMetadata: 'sm',
    stripColorProfile: 'scp',
    autoRotate: 'ar',
    filename: 'fn',
    format: 'f'
  },
  formatter: (key, value) => `${key}:${value}`
})

function urlSafeBase64 (value: Buffer | string) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

const hexDecode = (hex: string) => Buffer.from(hex, 'hex')

function sign (salt: string, target: string, secret: string) {
  const hmac = createHmac('sha256', hexDecode(secret))

  hmac.update(hexDecode(salt))
  hmac.update(target)

  return urlSafeBase64(hmac.digest())
}

const defaultModifiers = {
  fit: 'fill',
  width: 0,
  height: 0,
  gravity: 'no',
  enlarge: 1,
  format: 'webp'
}

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/', key, salt } = {}) => {
  const mergeModifiers = defu(modifiers, defaultModifiers)
  const encodedUrl = urlSafeBase64(src)
  const path = joinURL('/', operationsGenerator(mergeModifiers), encodedUrl)
  const signature = sign(salt, path, key)

  return {
    url: withBase(joinURL(signature, path), baseURL)
  }
}
