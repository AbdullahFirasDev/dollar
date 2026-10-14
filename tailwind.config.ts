/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        // Flat raw-color palette — no neon, no gradients
        primary: {
          50: '#eff8ff',
          100: '#d9ebff',
          200: '#b8dbff',
          500: '#0C6FFF', // Strong flat blue — brand / active
          600: '#0C6FFF',
          700: '#0a5cd6',
          800: '#084db0',
          900: '#073f8f',
        },
        brand: {
          50: '#eff8ff',
          100: '#d9ebff',
          500: '#0C6FFF',
          600: '#0C6FFF',
          700: '#0a5cd6',
        },
        accent: {
          DEFAULT: '#009FE4', // Cerulean blue — secondary accents
          light: '#4dc4f5',
          dark: '#0080b8',
        },
        // Flat rate indicators
        gain: {
          DEFAULT: '#16A34A', // flat green
          soft: '#f0fdf4',    // pastel badge bg
        },
        drop: {
          DEFAULT: '#DC2626', // flat red
          soft: '#fef2f2',    // pastel badge bg
        },
        ink: {
          DEFAULT: '#1E293B', // primary slate text
          strong: '#0F172A',  // bold numbers / headings
        },
        muted: {
          DEFAULT: '#606060', // secondary muted labels
        },
        page: {
          DEFAULT: '#F8FAFC', // base surface
          alt: '#F1F5F9',
        },
        surface: '#FFFFFF',     // card surface
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
