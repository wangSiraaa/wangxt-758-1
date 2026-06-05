/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1B4332',
          light: '#2D6A4F',
          dark: '#081C15',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#B7E4C7',
          400: '#D8F3DC',
          500: '#2D6A4F',
          600: '#1B4332',
          700: '#14532D',
          800: '#052E16',
          900: '#081C15',
        },
        amber: {
          DEFAULT: '#E9A319',
          light: '#F5C563',
          dark: '#B8860B',
        },
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
