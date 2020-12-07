import type { ProviderFactory } from 'src'

export const local = <ProviderFactory> function (providerOptions) {
  return {
    runtime: require.resolve('./runtime'),
    runtimeOptions: {
      baseURL: providerOptions.baseURL
    }
  }
}
