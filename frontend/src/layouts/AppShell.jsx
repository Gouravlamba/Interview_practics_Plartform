import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-bg text-white">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
