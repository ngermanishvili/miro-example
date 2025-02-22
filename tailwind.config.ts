import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // This is the correct type
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#171717",
      },
    },
  },
  plugins: [],
} satisfies Config;