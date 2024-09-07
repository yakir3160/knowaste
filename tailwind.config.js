/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        jaro: ['"Jaro"', 'sans-serif'],
        jost: ['"Jost"', 'sans-serif'],
        tac: ['"Tac One"', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
      },
      colors: {
        'base': '#F0F6E1FF',
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