export default function(providerOptions) {
  return {
    runtime: require.resolve('./runtime'),
    runtimeOptions: providerOptions
  }
}

