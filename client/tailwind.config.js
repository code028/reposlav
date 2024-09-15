/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        
        "white": "#ffffff",
        "black": "#000000",

        // Light colors
          "bg-l-primary": "#ffffff",
          "bg-l-secondary": "#dedede",

          "text-l-primary": "#000000",
          "text-l-secondary": "#9e9e9e",

        // Dark colors
          "bg-d-primary": "#000000",
          "bg-d-secondary": "#1f1f1f",
          "text-d-primary": "#ffffff",
          "text-d-secondary": "#9e9e9e",

      }
    },
  },
  plugins: [],
  // darkMode: 'class'
  darkMode: 'selector'
};
