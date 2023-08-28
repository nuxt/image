import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020420',
        },
        green: {
          50: '#d6ffee',
          100: '#acffdd',
          200: '#83ffcc',
          300: '#30ffaa',
          400: '#00dc82',
          500: '#00bd6f',
          600: '#009d5d',
          700: '#007e4a',
          800: '#005e38',
          900: '#003f25',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'DM Sans fallback', ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
