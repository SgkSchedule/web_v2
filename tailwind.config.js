module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b'
        }
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      'light-background': '#f5f5f4',
      'select-background': '#f5f9ff',
      'sgk-blue': '#1620a5'
    },
    fontFamily: {
      text: 'Inter, sans-serif',
      title: 'Manrope, sans-serif'
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
