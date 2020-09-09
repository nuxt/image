import { IPX } from 'ipx'

async function IPXReqHandler (ipx: any, url: string) {
  const urlArgs = url.substr(1).split('/')
  const format = decodeURIComponent(urlArgs.shift() || '')
  const operations = decodeURIComponent(urlArgs.shift() || '')
  const src = urlArgs.map(c => decodeURIComponent(c)).join('/')



  // Get basic info about request
  const info = await ipx.getInfo({ format, operations, src })



  // Process request to get image
  const data = await ipx.getData(info)

  // Send image
  return data
}

export default function IPXMiddleware (options: any) {
    const ipx = new IPX({
    input: {
        adapter: 'fs',
        dir: options.dir
    },
    });
  return async function IPXMiddleware (url: string) {
    return IPXReqHandler(ipx, url)
  }
}
