import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import InterviewSetupPage from './pages/InterviewSetupPage'
import LiveInterviewPage from './pages/LiveInterviewPage'
import PerformancePage from './pages/PerformancePage'
import MarketingPage from './pages/MarketingPage'
import AppShell from './layouts/AppShell'
import AuthLayout from './layouts/AuthLayout'
import { AnimatePresence } from 'framer-motion'
import { useApp } from './context/AppContext'

function ProtectedRoute({ children }) {
  const { user } = useApp()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/setup" element={<InterviewSetupPage />} />
          <Route path="/interview" element={<LiveInterviewPage />} />
          <Route path="/performance" element={<PerformancePage />} />
        </Route>

        <Route path="/mock-interview" element={<MarketingPage />} />
      </Routes>
    </AnimatePresence>
  )
}
