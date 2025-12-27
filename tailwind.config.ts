import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        renno: {
          orange: "#FF6B35",
          black: "#000000",
          white: "#FFFFFF",
          paper: "#FFF6F1", // subtle peach background like their landing
          ink: "#111111",
          muted: "#6B7280",
          line: "#E5E7EB",
        },
      },
      boxShadow: {
        renno: "6px 6px 0px 0px #000000",
        rennoSm: "3px 3px 0px 0px #000000",
      },
      borderRadius: {
        renno: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
