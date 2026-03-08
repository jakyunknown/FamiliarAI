/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#86efac', // light green
          400: '#4ade80', // green
        }
      }
    },
  },
  plugins: [],
}