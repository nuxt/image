export default defineEventHandler(async (event) => {
  const image = useImage(event)
  return image.getImage('/image.jpg', {
    provider: 'ipx',
    modifiers: {
      format: 'webp',
      quality: 75,
    },
  })
})
