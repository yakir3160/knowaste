/** @type {import('tailwindcss').Config} */

import tailwindHamburgers from 'tailwind-hamburgers';


module.exports = {
  content: [
      "./src/**/*.{html,js,jsx,css,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        josefin: ['"Josefin Sans"', 'sans-serif'],
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
        'inset-custom': 'inset 2px 2px 5px rgba(230, 232, 222, 0.7), inset -2px -2px 5px #EFF5DEFF',
'outer-custom': '2px 2px 3px #e6e8de, -2px 2px 3px #EFF5DEFF',
        'button-hover': '0px 0px 0px rgba(203, 209, 184, 0.60), -5px -5הpx 5px #fdfffa',
      },
      screens: {
        'iphone': '375px',
        'ipad': '790px',
        'lg': '1024px',
        'xl': '1280px',
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
        borderRotate: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
        fadeInDown: 'fadeInDown 0.8s',
        slideIn: 'slideIn 0.5s forwards',
        slideOut: ' slideOut 0.5s forwards',
        borderRotate: 'borderRotate 3s linear infinite',
      },
      animationDelay: {
        '1000': '1s',
        '2000': '2s',
      },

    },
    colors: {
      base: 'var(--base-color)',
      cards: 'var(--bs-card-bg)',
      buttons: 'var(--buttons-color)',
      titles: 'var(--titles-color)',
      secondary: 'var(--secondary-color)',
      lime: 'var(--lime-color)',
      errorRed: 'var(--errorRed)',
      errorLightRed: 'var(--errorLightRed)',
      gray:'var(--bs-gray)',
      black : 'var(--bs-black)',
      white: 'var(--bs-white)',
      green: 'var(--bs-green)',
      transparent: 'transparent',
      half_transparent: 'rgba(248,251,239,0.64)',
    },
  },
  plugins: [tailwindHamburgers],
};
