import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.password.trim()) next.password = 'Password is required'
    else if (form.password.length < 6) next.password = 'Minimum 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    login(form)
    navigate('/dashboard')
  }

  const mockGoogle = () => {
    login({ email: 'alex.chen@gmail.com' })
    navigate('/dashboard')
  }

  return (
    <PageTransition className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="relative w-full max-w-md rounded-[28px] border border-cyan-300/25 bg-[#091225]/80 p-8 shadow-neon backdrop-blur-xl">
        <div className="absolute -inset-1 -z-10 rounded-[32px] bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 blur-xl" />

        <div className="text-center">
          <h1 className="text-4xl font-bold leading-tight text-cyan-100">
            AI Platform <br />
            Secure Sign In
          </h1>
          <p className="mt-3 text-slate-300">Welcome to the Future of Talent</p>
        </div>

        <button
          onClick={mockGoogle}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 font-medium text-slate-800 transition hover:bg-slate-100"
        >
          <span className="text-lg">G</span>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-sm text-slate-400">
          <div className="h-px flex-1 bg-white/10" />
          or
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl border border-cyan-300/20 bg-[#0C1830] px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-300/40"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-cyan-300/20 bg-[#0C1830] px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-300/40"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-btn-gradient px-4 py-3 font-semibold text-white shadow-glowBtn transition hover:brightness-110"
          >
            Continue with email
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-400">
          <button className="hover:text-white">Forgot password?</button>
        </div>

        <p className="mt-4 text-center text-sm text-slate-400">
          New to AI Platform? <span className="cursor-pointer text-cyan-300">Create an account</span>
        </p>
      </div>
    </PageTransition>
  )
}
