import { createContext, useContext, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { initialMessages } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useLocalStorage('ai-platform-user', {
    name: 'Alex Chen',
    email: 'alex@auraui.dev',
  })

  const [interviewSetup, setInterviewSetup] = useLocalStorage('ai-platform-setup', {
    resumeName: 'JohnDoe_Resume.pdf',
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

  const [timer, setTimer] = useState(45 * 60 + 32)

  const login = ({ email }) => {
    const name = email?.split('@')[0]
      ? email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase())
      : 'Alex Chen'

    setUser({
      name,
      email: email || 'alex@auraui.dev',
    })
  }

  const logout = () => {
    localStorage.removeItem('ai-platform-user')
    window.location.href = '/login'
  }

  const sendMessage = (text) => {
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
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      interviewSetup,
      setInterviewSetup,
      messages,
      sendMessage,
      code,
      setCode,
      timer,
      setTimer,
    }),
    [user, interviewSetup, messages, code, timer]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
