/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontSize: {
      ssx: '6px',
      xs: '10px',
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    colors: {
      'T1-dark-green': '#2C3639',
      'T1-light-green': '#3F4E4F',
      'T1-brown': '#A27B5C',
      'T1-beige': '#DCD7C9',
      'white': '#ffff',
      'read-only': '#3F4E4F',

    },
    extend: {},
  },
  plugins: [],
}
