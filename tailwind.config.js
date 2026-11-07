/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F4F0',
        paper: '#FBFAF7',
        stone: '#E9E6DF',
        ink: '#111111',
        graphite: '#55534E',
        mute: '#8C8A84',
        glow: '#FFC97A',
        brand: {
          blue: '#111111',
          dark: '#111111',
          elevated: '#FBFAF7',
          surface: '#E9E6DF',
          light: '#F5F4F0',
        },
      },
      fontFamily: {
        editorial: ['"Bodoni Moda"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Bodoni Moda"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Inter Tight"', '"Inter"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      borderRadius: {
        card: '28px',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
