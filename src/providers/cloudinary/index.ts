import { ProviderFactory } from '../../types'

export default <ProviderFactory> function (providerOptions) {
  return {
    runtime: require.resolve('./runtime'),
    runtimeOptions: providerOptions
  }
}
