import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Bot,
  BarChart3,
  Settings,
  LogOut,
  BrainCircuit,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Candidates', icon: Users, to: '/setup' },
  { label: 'AI Interviewer', icon: Bot, to: '/interview' },
  { label: 'Analytics', icon: BarChart3, to: '/performance' },
  { label: 'Settings', icon: Settings, to: '/setup' },
]

export default function Sidebar() {
  const { user, logout } = useApp()
  const navigate = useNavigate()

  return (
    <aside className="hidden w-[260px] flex-col border-r border-white/10 bg-[#0A0F22] px-4 py-5 lg:flex">
      <button onClick={() => navigate('/dashboard')} className="mb-8 flex items-center gap-3 text-left">
        <div className="rounded-2xl bg-white/5 p-2 shadow-neon">
          <BrainCircuit className="h-6 w-6 text-cyan-300" />
        </div>
        <span className="text-2xl font-bold">AuraAI</span>
      </button>

      <div className="flex flex-1 flex-col gap-2">
        {items.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? 'border border-fuchsia-400/30 bg-gradient-to-r from-cyan-400/15 to-fuchsia-500/15 text-white shadow-neon'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
          <img
            src="[i.pravatar.cc](https://i.pravatar.cc/100?img=11)"
            alt={user?.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{user?.name || 'Alex Chen'}</p>
            <p className="text-xs text-slate-400">{user?.email || 'alex@auraui.dev'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
