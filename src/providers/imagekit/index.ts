import { ProviderFactory } from 'src'

export const imagekit = <ProviderFactory> function (providerOptions) {
  return {
    runtime: require.resolve('./runtime'),
    runtimeOptions: providerOptions
  }
}
