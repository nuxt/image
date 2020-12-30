import { ProviderFactory } from 'src'

export const storyblok = <ProviderFactory> function (providerOptions) {
  return {
    runtime: require.resolve('./runtime'),
    runtimeOptions: providerOptions
  }
}
