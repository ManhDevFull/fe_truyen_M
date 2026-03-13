/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0b",
        sand: "#f6f3ef",
        accent: "#c7522a"
      }
    }
  },
  plugins: []
};
