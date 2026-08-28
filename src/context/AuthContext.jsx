import { createContext, useContext, useState } from 'react'
import { login as loginRequest } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('authUser')
    return stored ? JSON.parse(stored) : null
  })

  async function login(email, password) {
    const { token, user: loggedInUser } = await loginRequest(email, password)
    localStorage.setItem('authToken', token)
    localStorage.setItem('authUser', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
  }

  function logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
