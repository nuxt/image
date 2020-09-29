import path from 'path'
import util from 'util'
import consola from 'consola'
import fetch from 'node-fetch'
import hasha from 'hasha'
import fs from 'fs-extra'

const streamPipeline = util.promisify(require('stream').pipeline)

export const logger = consola.withScope('@nuxt/image')

export function tryRequire (id) {
  try {
    const m = require(id)
    return m.default || m
  } catch (_err) {}
}

export async function downloadImage ({ url, name, outDir }) {
  try {
    const response = await fetch(url)
    if (!response.ok) { throw new Error(`unexpected response ${response.statusText}`) }
    await streamPipeline(response.body, fs.createWriteStream(path.join(outDir, name)))
    logger.success('Generated image ' + name)
  } catch (error) {
    logger.error(error.message)
  }
}

export function getFileExtension (url: string) {
  const extension = url.split(/[?#]/).shift().split('/').pop().split('.').pop()
  return extension
}

export function hash (value: string, length = 6) {
  return hasha(value).substr(0, length)
}
