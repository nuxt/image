module.exports = {
  launch: {
    // to use google chrome, install puppeteer with PUPPETEER_SKIP_CHROMIUM_DOWNLOAD env
    // and uncomment next line
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '–no-sandbox',
      '–disable-setuid-sandbox'
    ]
  }
}
