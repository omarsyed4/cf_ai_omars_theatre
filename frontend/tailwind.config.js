/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theater-primary': '#007AFF',
        'theater-secondary': '#5856D6',
        'theater-dark': '#1C1C1E',
        'theater-gray': '#2C2C2E',
        'theater-light': '#F2F2F7',
      },
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
      },
      boxShadow: {
        'ios': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'ios-lg': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'ios-xl': '0 8px 24px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}

