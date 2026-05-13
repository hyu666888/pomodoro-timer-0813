/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tomato: {
          50:  '#fff5f5',
          100: '#fde8e6',
          200: '#fcc9c4',
          300: '#f9a097',
          400: '#f47066',
          500: '#e8463b',
          600: '#c93028',
          700: '#a52520',
          800: '#7f1e1a',
          900: '#5c1815',
        },
        cream: {
          50:  '#fdfaf5',
          100: '#f9f3e8',
          200: '#f2e6d0',
          300: '#e8d4b0',
          400: '#d9be8e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
