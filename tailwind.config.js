/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#131209', 900: '#181818', 850: '#1F1F1F', 800: '#272727', 700: '#313131' },
        paper: '#F2EFEA',
        sub: '#CFC9C2',
        mute: '#9A938B',
        greige: '#A9A29B',
        coral: { DEFAULT: '#E8774F', hi: '#F08C68' },
        ice: '#B6D1EE',
        line: 'rgba(242,239,234,0.12)',
      },
      fontFamily: {
        display: ['Newsreader', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: { page: '1200px' },
      borderRadius: { card: '18px' },
    },
  },
  plugins: [],
}
