import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import GlowButton from '../components/GlowButton'
import PageTransition from '../components/PageTransition'
import brain from '../assets/brain.svg'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <PageTransition className="relative min-h-screen overflow-hidden bg-bg">
      <div className="absolute inset-0 circuit-bg grid-bg" />
      <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <Navbar />

      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 py-10 lg:px-8">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight text-white md:text-6xl">
              The Future of <br />
              Hiring is Here
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Automate candidate screening, assess skills with AI-driven insights,
              and make data-backed hiring decisions faster than ever before.
            </p>
            <div className="mt-8">
              <GlowButton className="min-w-[240px] text-lg" onClick={() => navigate('/login')}>
                Get Started
              </GlowButton>
            </div>
          </div>

          <div className="relative flex justify-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative"
            >
              <img
                src={brain}
                alt="AI Brain"
                className="w-full max-w-[500px] drop-shadow-[0_0_40px_rgba(127,166,255,0.4)]"
              />
              <div className="absolute inset-x-12 bottom-2 h-10 rounded-full bg-blue-400/25 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
