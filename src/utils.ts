import consola from 'consola'
import fetch from 'node-fetch'
import hash from 'hasha'
import fs from 'fs-extra'
import path from 'path'
import util from 'util'

const streamPipeline = util.promisify(require('stream').pipeline)

export const logger = consola.withScope('@nuxt/image')

export function tryRequire(id) {
    try {
        const m = require(id)
        return m.default || m
    } catch(_err) {}
}

export async function downloadImage({url, name, outDir}) {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
        await streamPipeline(response.body, fs.createWriteStream(path.join(outDir, name)))
        logger.success("Generated image " + name)
    } catch (error) {
        logger.error(error.message)
    }
}

export function getFileExtension(url: string) {
    const [_, extension] = url.split(/[\?#]/).shift().split('/').pop().split('.');
    return extension
}

export function hashGenerator(length = 6) {
    const usedHashs = {};
    return (value: string) => {
        let hashLength = length
        let newHash = hash(value).substr(0, hashLength)
        while (usedHashs[newHash]) {
            hashLength += 1
            newHash = hash(value).substr(0, hashLength)
        }
        return newHash
    }
}
  