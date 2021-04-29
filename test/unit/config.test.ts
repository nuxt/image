import { get, setupTest } from '@nuxt/test-utils'

describe('undefined config', () => {
  setupTest({
    server: true,
    config: {}
  })

  test('does not optimize images', async () => {
    const { body } = await get('/')
    expect(body).toContain('<img width="300" height="200" src="/2000px-Aconcagua2016.jpg">')
  })
})

describe('Custom provider', () => {
  setupTest({
    server: true,
    config: {
      image: {
        provider: 'random',
        providers: {
          random: {
            provider: '~/providers/random'
          }
        }
      }
    }
  })

  test('render index', async () => {
    const { body } = await get('/')
    expect(body).toContain('<img width="300" height="200" src="https://source.unsplash.com/random/600x400">')
  })
})
