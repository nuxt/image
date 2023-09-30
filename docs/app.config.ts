export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'slate',
  },
  elements: {
    variables: {
      light: {
        background: '255 255 255',
        foreground: 'var(--color-gray-700)',
      },
      dark: {
        background: 'var(--color-gray-950)',
        foreground: 'var(--color-gray-200)',
      },
    },
  },
})
