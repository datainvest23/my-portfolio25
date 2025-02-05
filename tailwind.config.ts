import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        'card': '4px 4px 10px rgba(0, 0, 0, 0.1)',
        'card-hover': '8px 8px 20px rgba(0, 0, 0, 0.2)',
      },
      transitionProperty: {
        'all': 'all',
      },
      borderWidth: {
        'hover': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
