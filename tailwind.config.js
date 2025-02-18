/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          600: '#008080',
        },
        beige: '#F5E8C7',
        'deep-blue': '#2C3E50',
        'pastel-green': '#A7D7C5',
      },
    },
  },
  plugins: [],
};
