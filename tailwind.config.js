/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          border: '#334155',
          text: '#F8FAFC',
          muted: '#94A3B8'
        },
        primary: {
          DEFAULT: '#3B82F6', // Blue 500
          hover: '#60A5FA', // Blue 400
        },
        accent: {
          DEFAULT: '#8B5CF6', // Violet 500
          hover: '#A78BFA', // Violet 400
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
