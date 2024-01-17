/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "app/**/*.{tsx,ts}",
    "components/**/*.{tsx,ts}",
    "content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--f-font)"],
        mono: ["var(--f-mono-font)"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};