export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "gray-dark-main": "#23242A",
        "gray-dark-second": "#28292D",
        "gray-light": "#D3DCE6",
        "red-main": "#FF4B45",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
