import { useEffect, useMemo, useState, useRef } from 'react'
import { Mic, MessageSquare, HelpCircle } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import ChatBubble from '../components/ChatBubble'
import CodeEditorPanel from '../components/CodeEditorPanel'
import { useApp } from '../context/AppContext'
import { connectSocket, disconnectSocket, joinRoom, sendSocketMessage, requestAI, emitCodeUpdate, saveCode } from '../services/socket'
import { aiApi } from '../services/api'

export default function LiveInterviewPage() {
  const { messages, setMessages, code, setCode, timer, setTimer, currentSession } = useApp()
  const [draft, setDraft] = useState('')
  const [socketReady, setSocketReady] = useState(false)
  const socketRef = useRef(null)
  const roomId = currentSession?.roomId
  const sessionId = currentSession?._id || currentSession?.id

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [setTimer])

  useEffect(() => {
    if (!roomId) return

    const socket = connectSocket()
    socketRef.current = socket
    setSocketReady(true)

    joinRoom(roomId, sessionId)

    socket.on('receive-message', (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })

    socket.on('ai-response', (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })

    socket.on('code-sync', ({ code: newCode }) => {
      setCode(newCode)
    })

    socket.on('session-history', ({ messages: hist }) => {
      if (hist?.length > 0) setMessages(hist)
    })

    return () => {
      socket.off('receive-message')
      socket.off('ai-response')
      socket.off('code-sync')
      socket.off('session-history')
      disconnectSocket()
    }
  }, [roomId, sessionId, setMessages, setCode])

  const timeString = useMemo(() => {
    const m = String(Math.floor(timer / 60)).padStart(2, '0')
    const s = String(timer % 60).padStart(2, '0')
    return `00:${m}:${s}`
  }, [timer])

  const handleSend = async () => {
    if (!draft.trim()) return
    const text = draft.trim()
    setDraft('')

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])

    if (roomId && socketRef.current?.connected) {
      sendSocketMessage(roomId, sessionId, text)
      requestAI(roomId, sessionId, text)
    } else {
      try {
        const { data } = await aiApi.getInsight({ message: text, sessionId })
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, aiMsg])
      } catch {
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Good answer. Try structuring it with edge cases, time complexity, and a quick example for clarity.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }])
      }
    }
  }

  const handleCodeChange = (newCode) => {
    setCode(newCode)
    if (roomId && socketRef.current?.connected) {
      emitCodeUpdate(roomId, newCode, 'python')
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/90 px-5 py-3 text-slate-900 shadow-card">
          <h1 className="text-2xl font-semibold">Live AI Interview Room</h1>
          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-xl bg-slate-100 px-4 py-2">{timeString}</div>
            <div className="rounded-xl bg-slate-100 px-4 py-2">Difficulty: Medium</div>
            <button className="rounded-xl border border-slate-200 px-4 py-2">Exit Interview</button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1.05fr]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
            <div className="h-[640px] overflow-y-auto p-4 text-slate-900">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} {...msg} />
              ))}
              <div className="mt-2 text-sm text-slate-500">Listening...</div>
            </div>

            <div className="border-t border-slate-200 p-4">
              <div className="mb-4 flex items-center gap-2">
                <button className="rounded-full border border-slate-300 p-3 text-slate-600">
                  <MessageSquare className="h-5 w-5" />
                </button>
                <button className="rounded-full border border-slate-300 p-3 text-slate-600">
                  <HelpCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type your response..."
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none"
                />
                <button
                  onClick={handleSend}
                  className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white"
                >
                  Send
                </button>
              </div>

              <div className="mt-5 flex justify-center">
                <button className="grid h-20 w-20 place-items-center rounded-full bg-btn-gradient text-white shadow-glowBtn">
                  <Mic className="h-8 w-8" />
                </button>
              </div>
              <p className="mt-2 text-center text-sm text-slate-600">Tap to Speak</p>
            </div>
          </div>

          <CodeEditorPanel code={code} setCode={handleCodeChange} />
        </div>
      </div>
    </PageTransition>
  )
}
