/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        // Primary palette (used by primary-* classes across components)
        primary: {
          50: '#eaf2ff',
          100: '#d6e6ff',
          500: '#0C6FFF', // Primary Blue
          600: '#0C6FFF',
          700: '#0a5cd6',
          800: '#084db0',
          900: '#073f8f',
        },
        brand: {
          50: '#eaf2ff',
          100: '#d6e6ff',
          500: '#0C6FFF', // Primary Blue
          600: '#0C6FFF',
          700: '#0a5cd6',
        },
        mint: {
          DEFAULT: '#60CBC7', // Mint / Secondary Accent
          light: '#8ddad7',
          dark: '#3fa39f',
        },
        cyan: {
          highlight: '#009FE4', // Cyan / Highlight
        },
        muted: {
          DEFAULT: '#606060', // Dark Neutral / Text Muted
        },
        surface: {
          DEFAULT: '#FFFFFF', // Card / Surface Background
        },
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      // Mobile-first touch targets ≥ 48px
      minHeight: {
        touch: '48px',
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}
