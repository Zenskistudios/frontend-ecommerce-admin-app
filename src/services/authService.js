import api, { MOCK_MODE } from './api'

// Placeholder contract: POST /auth/login -> { token, user }
// Update the path/shape once the auth endpoint from later tasks exists.

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

export async function login(email, password) {
  if (MOCK_MODE) {
    await delay()
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    // Any credentials work in mock mode so the UI is fully clickable
    // before the real auth endpoint exists.
    return {
      token: `mock-token-${Date.now()}`,
      user: { name: email.split('@')[0], email, role: 'admin' },
    }
  }
  const { data } = await api.post('/auth/login', { email, password })
  return data
}
