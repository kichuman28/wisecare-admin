/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2D336B', // dark blue
          hover: '#7886C7',   // medium blue
          light: '#A9B5DF',   // light blue
        },
        background: {
          DEFAULT: '#ffffff', 
          secondary: '#f8f9fa',
        },
        teal: {
          600: '#008080',
        },
        beige: '#F5E8C7',
        'deep-blue': '#2C3E50',
        'pastel-green': '#A7D7C5',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out'
      }
    },
  },
  plugins: [],
};
