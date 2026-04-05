import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
})

const getAccessToken = () => localStorage.getItem('ai-platform-access-token')
const getRefreshToken = () => localStorage.getItem('ai-platform-refresh-token')
const setTokens = (access, refresh) => {
  localStorage.setItem('ai-platform-access-token', access)
  if (refresh) localStorage.setItem('ai-platform-refresh-token', refresh)
}
const clearTokens = () => {
  localStorage.removeItem('ai-platform-access-token')
  localStorage.removeItem('ai-platform-refresh-token')
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let refreshQueue = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      isRefreshing = true
      try {
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken })
        const { accessToken, refreshToken: newRefresh } = data.data
        setTokens(accessToken, newRefresh)
        refreshQueue.forEach((p) => p.resolve(accessToken))
        refreshQueue = []
        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      } catch {
        refreshQueue.forEach((p) => p.reject(error))
        refreshQueue = []
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export { setTokens, clearTokens, getAccessToken }

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  refresh: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),
}

export const userApi = {
  getProfile: () => api.get('/api/users/me'),
  updateProfile: (data) => api.patch('/api/users/me', data),
}

export const sessionApi = {
  create: (data) => api.post('/api/sessions', data),
  getAll: (params) => api.get('/api/sessions', { params }),
  getById: (id) => api.get(`/api/sessions/${id}`),
  update: (id, data) => api.patch(`/api/sessions/${id}`, data),
  getUpcoming: () => api.get('/api/sessions/upcoming'),
  getRecordings: () => api.get('/api/sessions/recordings'),
}

export const roleApi = {
  getAll: () => api.get('/api/roles'),
  create: (data) => api.post('/api/roles', data),
  update: (id, data) => api.patch(`/api/roles/${id}`, data),
  delete: (id) => api.delete(`/api/roles/${id}`),
}

export const analyticsApi = {
  getDashboard: () => api.get('/api/analytics/dashboard'),
  getTrend: (params) => api.get('/api/analytics/trend', { params }),
  getInsights: () => api.get('/api/analytics/insights'),
}

export const fileApi = {
  upload: (formData) =>
    api.post('/api/files', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: () => api.get('/api/files'),
  delete: (id) => api.delete(`/api/files/${id}`),
}

export const aiApi = {
  getInsight: (data) => api.post('/api/ai/insight', data),
  saveMessage: (data) => api.post('/api/ai/message', data),
}

export const questionApi = {
  getAll: (params) => api.get('/api/questions', { params }),
  create: (data) => api.post('/api/questions', data),
}

export default api
