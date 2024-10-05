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
        'inset-custom': 'inset 6px 6px 10px #e6e8de, inset -9px -9px 10px #ffffff',
        'outer-custom': '10px 10px 20px #e6e8de, -10px -10px 20px #ffffff',
        'button-hover': '5px 5px 10px rgba(203, 209, 184, 0.60), -5px -5px 10px #fdfffa',
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
    colors: {
      base: 'var(--base-color)',
      buttons: 'var(--buttons-color)',
      titles: 'var(--titles-color)',
      secondary: 'var(--secondary-color)',
      lime: 'var(--lime-color)',
      errorRed: 'var(--errorRed)',
      errorLightRed: 'var(--errorLightRed)',
      gray:'var(--bs-gray)',
      black : 'var(--bs-black)',
      green: 'var(--bs-green)',
    },
  },
  plugins: [tailwindHamburgers],
};
