/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#181818",
        secondary: "#222222",
        ink: "#EDEBE6",
        muted: "#A0A0A0",
        line: "#464646",
        accent: "#899474",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "Arial", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
      fontSize: {
        hero: "clamp(4rem, 9vw, 9rem)",
        section: "clamp(2.5rem, 6vw, 6rem)",
        project: "clamp(2rem, 4vw, 4.5rem)",
      },
      letterSpacing: {
        label: "0.1em",
      },
      maxWidth: {
        container: "1600px",
      },
    },
  },
  plugins: [],
};
