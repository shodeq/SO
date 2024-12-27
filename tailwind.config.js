/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/pages/**/*.{html}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        onest: ["Onest", "sans-serif"],
        caveat: ["Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};

