/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'adr-brown': '#8B5A3C',
        'adr-gold': '#D4A574', 
        'adr-light-brown': '#C8956D',
        'adr-cream': '#F5F5F5',
        'adr-bronze': '#B8956A'
      },
      fontFamily: {
        'hebrew': ['Heebo', 'sans-serif'],
        'english': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
