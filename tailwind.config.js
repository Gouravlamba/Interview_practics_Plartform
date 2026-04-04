/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#070B14',
        panel: '#0E1424',
        panel2: '#11182B',
        borderGlow: 'rgba(100, 149, 255, 0.28)',
        neonBlue: '#2F80FF',
        neonCyan: '#50E6FF',
        neonPurple: '#A855F7',
        textSoft: '#B8C2D9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(103, 182, 255, 0.25), 0 0 20px rgba(47,128,255,0.18), 0 0 40px rgba(168,85,247,0.14)',
        card: '0 10px 30px rgba(0,0,0,0.35)',
        glowBtn: '0 0 0 1px rgba(80, 230, 255, 0.2), 0 8px 30px rgba(47,128,255,.45)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(80,230,255,.12), transparent 25%), radial-gradient(circle at top right, rgba(168,85,247,.12), transparent 25%), linear-gradient(to bottom right, rgba(255,255,255,.02), rgba(255,255,255,0))',
        'btn-gradient':
          'linear-gradient(90deg, #1C7DFF 0%, #2F80FF 50%, #4DA8FF 100%)',
        'neon-border':
          'linear-gradient(135deg, rgba(80,230,255,.55), rgba(168,85,247,.45))',
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
        gradientShift: 'gradientShift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow:
              '0 0 0 1px rgba(103,182,255,0.25), 0 0 18px rgba(47,128,255,0.2), 0 0 36px rgba(168,85,247,0.12)',
          },
          '50%': {
            boxShadow:
              '0 0 0 1px rgba(103,182,255,0.45), 0 0 28px rgba(47,128,255,0.35), 0 0 50px rgba(168,85,247,0.2)',
          },
        },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
