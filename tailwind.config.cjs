/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        hub: {
          red: '#ff3b30',
        },
      },
      boxShadow: {
        'card': '0 10px 25px rgba(15,23,42,0.6)',
      },
    },
  },
  plugins: [],
}
