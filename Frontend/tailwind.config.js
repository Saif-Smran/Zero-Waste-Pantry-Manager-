/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        safe: '#2e7d32',
        warning: '#e65100',
        danger: '#c62828',
        pantry: {
          bg: '#f5f5f5',
          card: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}

