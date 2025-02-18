/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D336B', // dark blue
          hover: '#7886C7',   // medium blue
          light: '#A9B5DF',   // light blue
        },
        background: {
          DEFAULT: '#ffffff', // white instead of light pink
          secondary: '#f8f9fa',
        },
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
