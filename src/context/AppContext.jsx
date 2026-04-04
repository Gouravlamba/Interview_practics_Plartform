import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { initialMessages } from '../data/mockData'
import { authApi, setTokens, clearTokens } from '../services/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useLocalStorage('ai-platform-user', null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  const [interviewSetup, setInterviewSetup] = useLocalStorage('ai-platform-setup', {
    resumeName: '',
    jobDescription: '',
    persona: 'Startup Founder',
  })

  const [messages, setMessages] = useLocalStorage('ai-platform-messages', initialMessages)
  const [code, setCode] = useLocalStorage(
    'ai-platform-code',
    `def frequency_counter(arr):
    frequency = {}
    if not arr:
        return frequency

    for item in arr:
        frequency[item] = frequency.get(item, 0) + 1

    return frequency`
  )

  const [currentSession, setCurrentSession] = useLocalStorage('ai-platform-session', null)
  const [timer, setTimer] = useState(45 * 60 + 32)

  const login = useCallback(
    async ({ email, password }) => {
      setAuthLoading(true)
      setAuthError(null)
      try {
        const { data } = await authApi.login({ email, password })
        const { user: userData, accessToken, refreshToken } = data.data
        setTokens(accessToken, refreshToken)
        setUser(userData)
        return { success: true }
      } catch (err) {
        const msg = err.response?.data?.message || 'Login failed'
        setAuthError(msg)
        return { success: false, message: msg }
      } finally {
        setAuthLoading(false)
      }
    },
    [setUser]
  )

  const register = useCallback(
    async ({ name, email, password }) => {
      setAuthLoading(true)
      setAuthError(null)
      try {
        const { data } = await authApi.register({ name, email, password })
        const { user: userData, accessToken, refreshToken } = data.data
        setTokens(accessToken, refreshToken)
        setUser(userData)
        return { success: true }
      } catch (err) {
        const msg = err.response?.data?.message || 'Registration failed'
        setAuthError(msg)
        return { success: false, message: msg }
      } finally {
        setAuthLoading(false)
      }
    },
    [setUser]
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore errors on logout
    }
    clearTokens()
    setUser(null)
    setCurrentSession(null)
    window.location.href = '/login'
  }, [setUser, setCurrentSession])

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim()) return

      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Good answer. Try structuring it with edge cases, time complexity, and a quick example for clarity.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, userMessage, aiMessage])
    },
    [setMessages]
  )

  const value = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      authError,
      login,
      register,
      logout,
      interviewSetup,
      setInterviewSetup,
      messages,
      setMessages,
      sendMessage,
      code,
      setCode,
      currentSession,
      setCurrentSession,
      timer,
      setTimer,
    }),
    [user, authLoading, authError, interviewSetup, messages, code, currentSession, timer, login, register, logout, sendMessage, setMessages, setInterviewSetup, setCode, setCurrentSession, setUser, setTimer]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
