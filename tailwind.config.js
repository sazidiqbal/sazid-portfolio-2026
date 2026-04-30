/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#05070b",
        steel: "#0b0f16",
        fog: "#9ea7b6",
        cyan: "#ffffff",
        royal: "#6d8cff",
        ember: "#ff9f5a"
      },
      fontFamily: {
        display: ['"Sora"', "sans-serif"],
        body: ['"Manrope"', "sans-serif"]
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.24)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
