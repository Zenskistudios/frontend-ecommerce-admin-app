import axios from 'axios'

// Points at your backend once it's live. Set VITE_API_BASE_URL in a .env
// file (see .env.example). Until then, MOCK_MODE below keeps the UI usable.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Flip to false the moment the real backend is reachable.
// Auto-enabled when no base URL has been configured at all.
export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true' || !import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the stored auth token to every request once logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Centralize 401 handling so every page doesn't have to check it separately.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
