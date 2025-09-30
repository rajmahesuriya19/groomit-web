// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: '#FF314A',
        lightGray: '#F2F4F7',
        cardBg: '#FAFAFA',
        white: '#FFFFFF',
        primary: {
          dark: '#2E2E2E',
          light: '#7C868A',
          line: '#BEC3C5'
        },
      },
    },
  },
}
