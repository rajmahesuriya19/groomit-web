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
        filson: ['"Filson Soft"', 'sans-serif'],
      },
      colors: {
        brand: '#FF314A',
        lightGray: '#F2F4F7',
        cardBg: '#FAFAFA',
        white: '#FFFFFF',
        borderLight: '#E4E4E4',
        red: '#EB5757',
        color11: '#28B446',
        color12: '#EB5757',
        color17: '#9449CE',
        color29: '#2F87D8',
        color47: '#438B53',
        color48: '#FFBF00',
        color49: '#FF8A00',
        green: {
          dark: '#0A7170',
        },
        primary: {
          dark: '#2E2E2E',
          light: '#7C868A',
          line: '#BEC3C5'
        },
      },
    },
  },
}
