/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0f0c29',
          900: '#1a1a2e',
          800: '#16213e',
        },
        accent: {
          orange: '#f7971e',
          yellow: '#ffd200',
          blue: '#667eea',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}