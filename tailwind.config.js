/** @type {import('tailwindcss').Config} */

import tailwindHamburgers from 'tailwind-hamburgers';

module.exports = {
  content: ["./src/**/*.{html,js,jsx,css,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jaro: ['"Jaro"', 'sans-serif'],
        jost: ['"Jost"', 'sans-serif'],
        tac: ['"Tac One"', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
      },
      borderRadius: {
        sm:'25px',
        md:'30px',
        lg:'35px',
      },
      fontSize: {
        'logo-sm': '2.5rem',
        'logo-md': '3rem',
        'logo-lg': '3.5rem',
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
        'baseLight': '#f4f8ea',
        'inputs': '#fafcf6',
      },
      screens: {
        'iphone': '375px',
        'ipad': '790px',
        '2xl': '1536px',
        '3xl': '1600px',
      },
      gridAutoColumns: {
        '2fr': 'minmax(0, 2fr)',
        '3fr': 'minmax(0, 3fr)',
        '1fr': 'minmax(0, 1fr)',
        'max-content': 'max-content',
        'min-content': 'min-content',
        'auto': 'auto',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' }
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.9s ease-in-out forwards',
        fadeInDown: 'fadeInDown 0.8s',
        slideIn: 'slideIn 0.5s forwards',
        slideOut: ' slideOut 0.5s forwards',
      },

    },
  },
  plugins: [tailwindHamburgers],
};
