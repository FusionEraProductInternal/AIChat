/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          red: '#FF3B30',
          orange: '#FF9500',
          yellow: '#FFCC00',
          pink: '#FF2D55',
          purple: '#AF52DE',
          indigo: '#5856D6',
          teal: '#5AC8FA',
          gray: '#8E8E93',
          bg: '#F2F2F7',
          card: '#FFFFFF',
          separator: '#C6C6C8'
        }
      },
      borderRadius: {
        'ios': '10px',
        'ios-lg': '14px',
        'ios-xl': '20px'
      },
      boxShadow: {
        'ios': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
        'ios-lg': '0 4px 12px rgba(0,0,0,0.15)',
        'ios-modal': '0 10px 40px rgba(0,0,0,0.2)'
      }
    }
  },
  plugins: []
}
