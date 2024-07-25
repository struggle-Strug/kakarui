const { fontFamily } = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  jit: true,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // fontSize: {
      //   xs: ['0.625rem', '0.875rem'],
      //   sm: ['0.75rem', '1rem'],
      //   base: ['0.875rem', '1.25rem'],
      //   lg: ['1rem', '1.5rem'],
      //   xl: ['1.25rem', '1.75rem'],
      //   '2xl': ['1.5rem', '2rem'],
      //   '3xl': ['1.875rem', '2.25rem'],
      //   '4xl': ['2.25rem', '2.5rem'],
      // },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      height: {
        screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
      },
      colors: {
        black: 'var(--black)',
        white: 'var(--white)',
        orange: 'var(--orange)',

        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'primary-button': 'var(--primary-button)',

        warning: 'var(--warning)',
        error: 'var(--error)',
        success: 'var(--success)',
        pending: 'var(--pending)',
        'in-progress': 'var(--in-progress)',

        outline: 'var(--outline)',
        danger: 'var(--danger)',
        accent: 'var(--accent)',
        background: 'var(--background)',
        placeholder: 'var(--placeholder)',

        gray: 'var(--gray)',

        'light-gray': 'var(--light-gray)',

        'dark-gray': 'var(--dark-gray)',
        'dark-gray-2': 'var(--dark-gray-2)',
        'dark-gray-3': 'var(--dark-gray-3)',
        'border-gray': 'var(--border-gray)',
        'border-gray-2': 'var(--border-gray-2)',

        '--badge-red': 'var(--badge-red)',
        'indigo-rainbow': 'var(--indigo-rainbow)',
      },
      textColor: {
        primary: 'var(--primary)',
        sub: 'var(--accent)',
      },
      boxShadow: {
        media: 'var(--media-shadow)',
        popup: 'var(--popup-shadow)',
        light: 'var(--light-shadow)',
        drop: 'var(--drop-shadow)',
      },
      keyframes: {
        moveUp: {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-8%)' },
          '100%': { transform: 'translateY(-16%)' },
        },
        moveDown: {
          '0%': { transform: 'translateY(-16%)' },
          '50%': { transform: 'translateY(-8%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
      animation: {
        'move-up': 'moveUp 0.3s linear 1',
        'move-down': 'moveDown 0.3s linear 1',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('mac', '.mac &')
      addVariant('windows', '.windows &')
      addVariant('ios', '.ios &')
    }),
    require('tailwindcss-animate'),
  ],
}
