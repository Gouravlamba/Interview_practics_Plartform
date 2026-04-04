import { io } from 'socket.io-client'
import { getAccessToken } from './api'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

let socket = null

export function getSocket() {
  if (!socket || socket.disconnected) {
    socket = io(BASE_URL, {
      auth: { token: getAccessToken() },
      autoConnect: false,
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

export function connectSocket() {
  const s = getSocket()
  if (!s.connected) s.connect()
  return s
}

export function disconnectSocket() {
  if (socket?.connected) socket.disconnect()
}

export function joinRoom(roomId, sessionId) {
  const s = getSocket()
  s.emit('join-room', { roomId, sessionId })
}

export function leaveRoom(roomId) {
  const s = getSocket()
  s.emit('leave-room', { roomId })
}

export function sendSocketMessage(roomId, sessionId, message) {
  const s = getSocket()
  s.emit('send-message', { roomId, sessionId, message })
}

export function requestAI(roomId, sessionId, message, context) {
  const s = getSocket()
  s.emit('ai-request', { roomId, sessionId, message, context })
}

export function emitCodeUpdate(roomId, code, language) {
  const s = getSocket()
  s.emit('code-update', { roomId, code, language })
}

export function saveCode(sessionId, code, language) {
  const s = getSocket()
  s.emit('code-save', { sessionId, code, language })
}
