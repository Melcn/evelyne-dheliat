/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        playfair: ["Playfair Display"],
      },
      colors: {
        greyWeather: "#A4A4A4",
        ivory: "#F7F7FF",
        greyNav: "#D9D9D9",
        blackbeam: "#37323E",
      },
    },
  },
  plugins: [],
};
