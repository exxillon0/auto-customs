import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Делаем Manrope шрифтом по умолчанию
        sans: ["var(--font-manrope)", "sans-serif"], 
      },
    },
  },
  plugins: [],
};
export default config;