/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        jaro: ['"Jaro"', 'sans-serif'],
        jost: ['"Jost"', 'sans-serif'],
        tac: ['"Tac One"', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'inset-custom': 'inset 6px 6px 12px rgba(203, 209, 184, 0.60), inset -6px -6px 12px #feffef',
        'outer-custom': '13px 13px 20px #dbdfcc, -13px -13px 20px #faffeb',
      },
      colors: {
        'base': '#F0F6E1FF',
        'buttons': '#3B763B',
        'titles': '#2A522A',
        'secondary': '#E4EBCF',
        'lime': '#aae800',
        'baseLight': '#fbfdf6',
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