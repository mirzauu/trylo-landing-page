/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        marquee: "marquee var(--duration, 40s) linear infinite",
        "marquee-reverse": "marquee-reverse var(--duration, 40s) linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-50% - var(--gap)/2))" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(calc(-50% - var(--gap)/2))" },
          to: { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
