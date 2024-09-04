/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
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