/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'base': '#fbfbfb',
        'buttons': '#3B763B',
        'titles': '#2A522A',
        'secondary': '#E4EBCF',
        'lime': '#aae800',
      },
      screens: {
        '3xl': '1600px',
        '2xl': '1536px'
      },
      gridAutoColumns:{
        '2fr':'minmax(0,2fr'
      }
    },
    animation:{
      fadeIn: 'fadeIn 0.9s ease-in-out forwards',
    },
  },
  plugins: [],
}