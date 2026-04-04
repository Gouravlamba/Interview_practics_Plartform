import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-hero-grid" />
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      </div>
      <Outlet />
    </div>
  )
}
