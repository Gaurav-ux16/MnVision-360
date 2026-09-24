/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B4F8A',      // MOIL blue
          blue: '#1769AA',      // MOIL blue
          sky: '#0284C7',       // Government Accent Blue
          gold: '#F28C28',      // Manganese orange accent
          'gold-dark': '#D97706',
          bg: '#F8FAFC',        // PSU Light Grey Background
          surface: '#FFFFFF',   // White Card / Panel Background
          border: '#E2E8F0',    // Thin Clean Border
          'border-dark': '#CBD5E1',
          text: '#0F172A',      // Dark Slate Primary Text
          muted: '#475569',     // Muted Slate Secondary Text
          primary: '#1E3A8A',
          danger: '#DC2626',
          warning: '#D97706',
          success: '#16A34A',
          info: '#0284C7'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
